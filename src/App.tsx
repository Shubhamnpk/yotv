import { Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import useStore from './store/useStore';
import { useData } from './context/DataContext';

function AppLayout() {
  const { loading } = useData();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watch/:channelId" element={<WatchPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
}

export default App;