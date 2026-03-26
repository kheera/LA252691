import { mockServices } from './utils/mockData.js';
import { pubsub, EVENTS } from './pubsub.js';

const INTERVAL_MS = 5_000;

// Each service has a shared "load" driver (0–1) that represents current traffic
// intensity. RPS, CPU, and memory are all partly driven by this load so they
// move together during spikes. Each metric also has its own small noise term.
interface ServiceMetricState {
  // Shared traffic load driver: 0 = idle, 1 = fully pegged.
  load: number;
  // Countdown in ticks for the current spike; 0 = not spiking.
  spikeTicks: number;
  // Target load during a spike (reset to baseline when spike ends).
  spikeTarget: number;
  // Each service has its own stable baseline so they look distinct.
  baseRps: number;
  baseCpu: number;
  baseMemory: number;
}

// Clamp a value to [min, max] and round to `decimals` places.
function clamp(value: number, min: number, max: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(Math.min(max, Math.max(min, value)) * factor) / factor;
}

// Gaussian-ish noise via Box-Muller (fast, good enough for a simulator).
function randn(): number {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
}

// Seed each service with a randomly chosen stable baseline so services look distinct.
function seedState(): ServiceMetricState {
  return {
    load: 0.2 + Math.random() * 0.3,   // start at 20–50% load
    spikeTicks: 0,
    spikeTarget: 0,
    baseRps: 30 + Math.random() * 100,  // 30–130 rps at idle
    baseCpu: 10 + Math.random() * 25,   // 10–35% CPU at idle
    baseMemory: 150 + Math.random() * 350, // 150–500 MB at idle
  };
}

const serviceState = new Map<string, ServiceMetricState>();

/**
 * Starts a 5-second interval that publishes a ServiceMetricUpdate for every
 * service.
 *
 * A shared per-service "load" value (0–1) drives RPS, CPU, and memory in
 * concert so they spike together. Approx every 30 s (1-in-6 chance per tick)
 * a traffic spike fires, ramping load toward 0.75–1.0 for 3–7 ticks (~15–35 s)
 * before fading back to baseline. Error rate climbs slightly under high load.
 */
export function startMetricTicker(): void {
  setInterval(() => {
    const timestamp = new Date().toISOString();
    for (const service of mockServices) {
      if (service.status === 'DOWN') continue;

      if (!serviceState.has(service.id)) {
        serviceState.set(service.id, seedState());
      }
      const s = serviceState.get(service.id)!;

      // ── Spike management ──────────────────────────────────────────────────
      // Rather than animating each metric independently, a single "load" value
      // (0–1) acts as a shared driver for RPS, CPU, and memory. This makes all
      // three rise and fall together during a spike, which is how real services
      // behave: an inbound traffic burst drives up RPS first, which pegs CPU,
      // which eventually pressures memory (GC / buffer growth).
      if (s.spikeTicks > 0) {
        // During a spike: interpolate load 50% toward the spike target each
        // tick so the rise is fast (reaches ~94% of target within 4 ticks).
        s.load += (s.spikeTarget - s.load) * 0.5;
        s.spikeTicks -= 1;
      } else {
        // ~1-in-6 chance per tick ≈ a new spike roughly every 30 s.
        // Each service rolls independently so they don't all spike at once.
        if (Math.random() < 1 / 6) {
          s.spikeTarget = 0.75 + Math.random() * 0.25; // 75–100% load during spike
          s.spikeTicks = 3 + Math.floor(Math.random() * 5); // spike lasts 3–7 ticks (15–35 s)
        } else {
          // Between spikes: load decays slowly back toward ~20% idle baseline
          // (exponential decay coefficient 0.15) with a small random wobble.
          s.load += (0.2 - s.load) * 0.15 + randn() * 0.03;
        }
      }
      s.load = clamp(s.load, 0, 1, 3);

      // ── Derive metrics from load + per-metric noise ───────────────────────
      // Each metric = (service-specific idle baseline) + (load contribution)
      // + (small independent Gaussian noise). The load contribution is scaled
      // differently per metric to reflect real-world relationships:
      //   • RPS rises steeply and quickly with load.
      //   • CPU is roughly proportional to RPS but with a lower ceiling headroom.
      //   • Memory grows more slowly — it reflects buffer/object allocation which
      //     lags behind the request rate and doesn't fully release until GC runs.
      //   • Error rate only climbs measurably above ~80% load, simulating the
      //     queue saturation / timeout region of a service's capacity curve.
      const rps       = clamp(s.baseRps    + s.load * 200 + randn() * 6,  2,  300, 1);
      const cpu       = clamp(s.baseCpu    + s.load * 65  + randn() * 3,  2,   99);
      const memory    = clamp(s.baseMemory + s.load * 450 + randn() * 10, 80, 1200, 0);
      const errorRate = clamp((s.load > 0.8 ? (s.load - 0.8) * 12 : 0) + Math.random() * 0.4, 0, 10, 2);

      pubsub.publish(EVENTS.METRIC_UPDATED, {
        metricUpdated: {
          serviceId: service.id,
          timestamp,
          cpuPercent: cpu,
          memoryMb: memory,
          requestsPerSecond: rps,
          errorRate,
        },
      });
    }
  }, INTERVAL_MS);
}
