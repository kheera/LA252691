import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
        </Routes>
      </SplashProvider>
    </BrowserRouter>
  );
}

export default App;
