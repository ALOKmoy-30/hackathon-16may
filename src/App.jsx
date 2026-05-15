import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { useSocket } from './hooks/useSocket.jsx';
import { Layout } from './components/Layout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { SensorMap } from './pages/SensorMap.jsx';
import { EvacuationPaths } from './pages/EvacuationPaths.jsx';
import { ControlPanel } from './pages/ControlPanel.jsx';
import { Alerts } from './pages/Alerts.jsx';
import './index.css';

import { SystemLog } from './components/SystemLog.jsx';

function AppContent() {
  useSocket();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sensors" element={<SensorMap />} />
        <Route path="/evacuation" element={<EvacuationPaths />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
      <SystemLog />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
