import { useSensors } from '../hooks/useSensors.jsx';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { SensorCard } from '../components/SensorCard.jsx';
import { ChartWidget } from '../components/ChartWidget.jsx';
import { AlertBanner } from '../components/AlertBanner.jsx';
import { sendAlert } from '../services/telegramService.js';
import { Bell } from 'lucide-react';
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export function Dashboard() {
  const { sensors, loading } = useSensors();
  const { alerts, removeAlert, addAlert } = useAlerts();
  const { addLogEntry } = useContext(AppContext);
  const [sendingAlert, setSendingAlert] = useState(false);

  const mockChartData = [
    { time: '00:00', temperature: 20 },
    { time: '04:00', temperature: 22 },
    { time: '08:00', temperature: 25 },
    { time: '12:00', temperature: 28 },
    { time: '16:00', temperature: 26 },
    { time: '20:00', temperature: 23 },
  ];

  const totalSensors = sensors.length;
  const activeAlerts = alerts.length;
  const zones = new Set(sensors.map(s => s.zone)).size;

  const handleQuickAlert = async () => {
    setSendingAlert(true);
    addLogEntry({ type: 'warning', message: 'Manual Quick Alert triggered.' });
    const result = await sendAlert(`🚨 Emergency Alert from FireEvac Premium`);
    if (result.success) {
      addAlert({ title: 'Alert Sent', message: 'Telegram broadcast successful.', severity: 'critical' });
    }
    setSendingAlert(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Command Center</h1>
          <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Real-time building intelligence</p>
        </div>
        <button
          onClick={handleQuickAlert}
          disabled={sendingAlert}
          className="w-full sm:w-auto touch-target flex items-center justify-center gap-3 bg-red-500 text-white px-8 py-3 rounded-3xl font-black hover:bg-red-600 transition-all shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] danger-pulse"
        >
          <Bell size={20} />
          {sendingAlert ? 'BROADCASTING...' : 'EMERGENCY ALERT'}
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <AlertBanner key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Sensors', value: totalSensors, color: 'text-white' },
          { label: 'Active Alerts', value: activeAlerts, color: activeAlerts > 0 ? 'text-red-500 danger-pulse' : 'text-emerald-500' },
          { label: 'Intelligence Zones', value: zones, color: 'text-white' },
          { label: 'System Integrity', value: '100%', color: 'text-emerald-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-neutral-900 rounded-3xl p-8 transition-transform hover:scale-[1.02] duration-300">
            <h3 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{kpi.label}</h3>
            <p className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sensors.map(sensor => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-neutral-900 rounded-3xl p-8">
          <ChartWidget data={mockChartData} title="Thermal Gradient" dataKey="temperature" color="#EF4444" xAxisLabel="Time" yAxisLabel="Celsius" />
        </div>
        <div className="bg-neutral-900 rounded-3xl p-8">
          <ChartWidget data={mockChartData} title="Air Particulates" dataKey="temperature" color="#10B981" xAxisLabel="Time" yAxisLabel="PPM" />
        </div>
      </div>
    </div>
  );
}
