import { createContext, useState, useCallback, useEffect } from 'react';
import { getSensorData } from '../services/dataSource.js';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load sensor data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getSensorData();
        setSensors(data.sensors);
        setAlerts(data.alerts);
      } catch (error) {
        console.error('Failed to load sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [{ id: Date.now(), ...alert }, ...prev]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    sensors,
    setSensors,
    isConnected,
    setIsConnected,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
