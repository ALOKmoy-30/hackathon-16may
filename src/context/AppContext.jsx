import { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

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
