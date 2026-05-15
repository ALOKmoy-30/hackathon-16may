import { useSensors } from '../hooks/useSensors.jsx';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { SensorCard } from '../components/SensorCard.jsx';
import { ChartWidget } from '../components/ChartWidget.jsx';
import { AlertBanner } from '../components/AlertBanner.jsx';

export function Dashboard() {
  const { sensors, loading } = useSensors();
  const { alerts, removeAlert } = useAlerts();

  const mockChartData = [
    { time: '00:00', temperature: 20 },
    { time: '04:00', temperature: 22 },
    { time: '08:00', temperature: 25 },
    { time: '12:00', temperature: 28 },
    { time: '16:00', temperature: 26 },
    { time: '20:00', temperature: 23 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map(alert => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onClose={() => removeAlert(alert.id)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {loading ? (
          <p>Loading sensors...</p>
        ) : (
          sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget data={mockChartData} title="Temperature Trend" dataKey="temperature" color="#ef4444" />
        <ChartWidget data={mockChartData} title="Smoke Level Trend" dataKey="temperature" color="#f59e0b" />
      </div>
    </div>
  );
}
