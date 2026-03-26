import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OverviewPage } from './pages/overview/OverviewPage';
import { ServiceDetailPage } from './pages/service/ServiceDetailPage';
import { SplashProvider } from './components/Shell/SplashProvider';

export function App() {
  return (
    <BrowserRouter>
      <SplashProvider>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SplashProvider>
    </BrowserRouter>
  );
}

export default App;
