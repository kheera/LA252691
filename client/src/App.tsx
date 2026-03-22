import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SplashPage } from './pages/SplashPage';
import { DemoPage } from './pages/demo/DemoPage';
import { OverviewPage } from './pages/overview/OverviewPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/splash" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
