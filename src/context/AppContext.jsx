import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { getSensorData } from '../services/dataSource.js';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [systemLog, setSystemLog] = useState([]);
  const logRef = useRef(systemLog);

  const addLogEntry = useCallback((entry) => {
    setSystemLog(prev => {
      // Use random string appended to timestamp to guarantee unique keys
      const uniqueId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
      const newLog = [{ id: uniqueId, timestamp: new Date().toISOString(), ...entry }, ...prev];
      return newLog.slice(0, 50);
    });
  }, []);

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [{ id: Date.now(), ...alert }, ...prev]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  useEffect(() => {
    logRef.current = systemLog;
  }, [systemLog]);

  // Load sensor data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getSensorData();
        setSensors(data.sensors);
        setAlerts(data.alerts);
        addLogEntry({ type: 'info', message: `Initial sensor data loaded (${data.sensors.length} active sensors).` });
      } catch (error) {
        console.error('Failed to load sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [addLogEntry]);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    sensors,
    setSensors,
    isConnected,
    setIsConnected,
    systemLog,
    addLogEntry,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
