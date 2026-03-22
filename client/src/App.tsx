import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DemoPage } from './pages/demo/DemoPage';
import { OverviewPage } from './pages/overview/OverviewPage';
import { ServiceDetailPage } from './pages/service/ServiceDetailPage';
import { SplashProvider } from './components/SplashProvider';

export function App() {
  return (
    <BrowserRouter>
      <SplashProvider>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </SplashProvider>
    </BrowserRouter>
  );
}

export default App;
