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

  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a));
  }, []);

  const updateZoneStatus = useCallback((zoneId, status, disabled = false) => {
    setSensors(prev => prev.map(s => {
      if (s.zone === zoneId || (s.location === zoneId) || (s.name.includes(zoneId))) {
        return { 
          ...s, 
          status: disabled ? 'INACTIVE' : status,
          smokeLevel: status === 'DANGER' ? 100 : 0,
          gasLevel: status === 'DANGER' ? 100 : 0,
          value: status === 'DANGER' ? 100 : 0,
          disabled: disabled
        };
      }
      return s;
    }));
    addLogEntry({ type: 'info', message: `Zone ${zoneId} status updated to ${disabled ? 'DISABLED' : status}` });
  }, [addLogEntry]);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    acknowledgeAlert,
    sensors,
    setSensors,
    updateZoneStatus,
    isConnected,
    setIsConnected,
    systemLog,
    logs: systemLog,
    addLogEntry,
    loading,
    userRole: 'admin' // Mock userRole for compatibility
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
