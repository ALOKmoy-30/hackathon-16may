import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export function useAlerts() {
  const { alerts, addAlert, removeAlert } = useContext(AppContext);

  return {
    alerts,
    addAlert,
    removeAlert,
  };
}
