import { useSensors } from '../hooks/useSensors.jsx';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { SensorCard } from '../components/SensorCard.jsx';
import { ChartWidget } from '../components/ChartWidget.jsx';
import { AlertBanner } from '../components/AlertBanner.jsx';
import { sendAlert } from '../services/telegramService.js';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export function Dashboard() {
  const { sensors, loading } = useSensors();
  const { alerts, removeAlert, addAlert } = useAlerts();
  const [sendingAlert, setSendingAlert] = useState(false);

  const mockChartData = [
    { time: '00:00', temperature: 20 },
    { time: '04:00', temperature: 22 },
    { time: '08:00', temperature: 25 },
    { time: '12:00', temperature: 28 },
    { time: '16:00', temperature: 26 },
    { time: '20:00', temperature: 23 },
  ];

  // Calculate KPI values
  const totalSensors = sensors.length;
  const activeAlerts = alerts.length;
  const zones = new Set(sensors.map(s => s.location.split(' - ')[0])).size;
  const lastUpdate = new Date().toLocaleTimeString();

  // Handle Quick Alert
  const handleQuickAlert = async () => {
    setSendingAlert(true);
    const message = `🚨 <b>Test Alert from FireEvac System</b>\n\n` +
      `Time: ${new Date().toLocaleString()}\n` +
      `Total Sensors: ${totalSensors}\n` +
      `Active Alerts: ${activeAlerts}\n` +
      `Status: System operational\n\n` +
      `This is a test message from the FireEvac Dashboard.`;

    const result = await sendAlert(message);

    if (result.success) {
      addAlert({
        title: 'Test Alert Sent',
        message: 'Test message successfully sent to Telegram',
        severity: 'info',
      });
    } else {
      addAlert({
        title: 'Alert Failed',
        message: result.reason === 'not_configured'
          ? 'Telegram not configured. Check Control Panel for setup instructions.'
          : 'Failed to send alert to Telegram',
        severity: 'warning',
      });
    }

    setSendingAlert(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        {/* Quick Alert Button */}
        <button
          onClick={handleQuickAlert}
          disabled={sendingAlert}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bell size={20} />
          {sendingAlert ? 'Sending...' : 'Quick Alert'}
        </button>
      </div>

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Sensors</h3>
          <p className="text-3xl font-bold text-gray-900">{totalSensors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Alerts</h3>
          <p className="text-3xl font-bold text-red-600">{activeAlerts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Zones</h3>
          <p className="text-3xl font-bold text-gray-900">{zones}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Last Update</h3>
          <p className="text-xl font-bold text-gray-900">{lastUpdate}</p>
        </div>
      </div>

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
        <ChartWidget
          data={mockChartData}
          title="Temperature Trend"
          dataKey="temperature"
          color="#ef4444"
          xAxisLabel="Time"
          yAxisLabel="Temperature (°C)"
        />
        <ChartWidget
          data={mockChartData}
          title="Smoke Level Trend"
          dataKey="temperature"
          color="#f59e0b"
          xAxisLabel="Time"
          yAxisLabel="Smoke Level (ppm)"
        />
      </div>
    </div>
  );
}
