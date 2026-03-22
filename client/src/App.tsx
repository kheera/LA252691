import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SplashPage } from './pages/splash-page/SplashPage';
import { DemoPage } from './pages/demo/DemoPage';
import { OverviewPage } from './pages/overview/OverviewPage';
import { SplashProvider } from './components/SplashProvider';

export function App() {
  return (
    <BrowserRouter>
      <SplashProvider>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/splash" element={<SplashPage />} />
        </Routes>
      </SplashProvider>
    </BrowserRouter>
  );
}

export default App;
