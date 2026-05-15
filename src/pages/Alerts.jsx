import { useAlerts } from '../hooks/useAlerts.jsx';
import { AlertBanner } from '../components/AlertBanner.jsx';

export function Alerts() {
  const { alerts, removeAlert } = useAlerts();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Alerts</h1>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onClose={() => removeAlert(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
