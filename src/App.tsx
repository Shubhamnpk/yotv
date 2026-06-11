import { Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { AboutPage } from './pages/AboutPage';
import FloatScrollButton from './components/layout/FloatScrollButton';
import ScrollToTop from './components/layout/ScrollToTop';

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:channelId" element={<WatchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatScrollButton />
    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
}

