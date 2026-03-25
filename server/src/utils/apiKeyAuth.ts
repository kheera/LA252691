import { GraphQLError } from 'graphql';
import type { Request } from 'express';

const SERVICE_NAME = process.env.SERVICE_NAME ?? 'graphql-api';

function logAuthFailure(keyPresent: boolean, reason: 'absent' | 'incorrect'): void {
  // Log structured metadata — never log the key value itself.
  console.warn(JSON.stringify({
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    event: 'api_key_auth_failure',
    keyPresent,
    reason,
  }));
}

/**
 * Validates the x-api-key header on HTTP GraphQL requests.
 * Throws a spec-compliant GraphQLError (UNAUTHENTICATED) when the key is
 * absent or incorrect so the error surfaces in the GraphQL errors array, not
 * as a raw HTTP 4xx.
 */
export function validateHttpApiKey(req: Request): void {
  const expected = process.env.API_KEY!; // guaranteed set — index.ts exits if missing

  const raw = req.headers['x-api-key'];
  const provided = Array.isArray(raw) ? raw[0] : raw;

  if (!provided) {
    logAuthFailure(false, 'absent');
    throw new GraphQLError('API key is required', {
      extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
    });
  }

  if (provided !== expected) {
    logAuthFailure(true, 'incorrect');
    throw new GraphQLError('Invalid API key', {
      extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
    });
  }
}

/**
 * Validates the authorization connection param on WebSocket connections.
 * Returns false to close the socket (graphql-ws closes with 4403) when the
 * key is absent or incorrect.
 */
export function validateWsApiKey(
  params: Record<string, unknown> | undefined,
): boolean {
  const expected = process.env.API_KEY!; // guaranteed set — index.ts exits if missing

  const provided = params?.authorization;

  if (!provided) {
    logAuthFailure(false, 'absent');
    return false;
  }

  if (provided !== `Bearer ${expected}`) {
    logAuthFailure(true, 'incorrect');
    return false;
  }

  return true;
}
