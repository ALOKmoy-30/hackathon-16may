import { useSensors } from '../hooks/useSensors.jsx';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { SensorCard } from '../components/SensorCard.jsx';
import { ChartWidget } from '../components/ChartWidget.jsx';
import { AlertBanner } from '../components/AlertBanner.jsx';
import { sendAlert } from '../services/telegramService.js';
import { Bell, Activity, Thermometer, Shield, AlertTriangle } from 'lucide-react';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';

// SVG Temperature Gauge component
function TemperatureGauge({ value = 0, max = 100 }) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const prevOffsetRef = useRef(circumference);

  useEffect(() => {
    prevOffsetRef.current = offset;
  }, [offset]);

  const getColor = () => {
    if (percentage > 80) return '#ff4444';
    if (percentage >= 60) return '#ffaa00';
    return '#00ff88';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Track */}
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#222222" strokeWidth="6" />
        {/* Progress */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
        />
        {/* Center value */}
        <text x="90" y="85" textAnchor="middle" dominantBaseline="middle"
          className="text-4xl font-bold" fill="#f0f0f0">
          {value}
        </text>
        <text x="90" y="110" textAnchor="middle" fill="#888888" className="text-sm">
          °C
        </text>
      </svg>
    </div>
  );
}

export function Dashboard() {
  const { sensors, loading } = useSensors();
  const { alerts, removeAlert, addAlert } = useAlerts();
  const { addLogEntry } = useContext(AppContext);
  const [sendingAlert, setSendingAlert] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Day');

  const mockChartData = [
    { time: '00:00', temperature: 20 },
    { time: '04:00', temperature: 22 },
    { time: '08:00', temperature: 25 },
    { time: '12:00', temperature: 28 },
    { time: '16:00', temperature: 26 },
    { time: '20:00', temperature: 23 },
  ];

  const totalSensors = sensors?.length || 0;
  const activeAlerts = alerts?.length || 0;
  const zones = new Set((sensors || []).map(s => s.zone)).size;
  const avgTemp = sensors && sensors.length > 0
    ? Math.round(sensors.reduce((sum, s) => sum + (s.temperature || s.value || 0), 0) / sensors.length)
    : 24;

  const handleQuickAlert = async () => {
    setSendingAlert(true);
    addLogEntry({ type: 'warning', message: 'Manual Quick Alert triggered.' });
    const result = await sendAlert(`🚨 Emergency Alert from FireEvac Premium`);
    if (result.success) {
      addAlert({ title: 'Alert Sent', message: 'Telegram broadcast successful.', severity: 'critical' });
    } else if (result.reason === 'not_configured') {
      addAlert({ title: 'Alert Failed', message: 'Telegram is not connected. System is using dummy data.', severity: 'warning' });
      addLogEntry({ type: 'error', message: 'Failed to send alert: Telegram not configured.' });
    } else {
      addAlert({ title: 'Alert Failed', message: 'Failed to broadcast Telegram alert.', severity: 'warning' });
    }
    setSendingAlert(false);
  };

  const kpis = [
    { icon: Activity, label: 'Total Sensors', value: totalSensors },
    { icon: AlertTriangle, label: 'Active Alerts', value: activeAlerts },
    { icon: Shield, label: 'Zones', value: zones },
    { icon: Thermometer, label: 'System Health', value: '100%' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f0f0f0]">Dashboard</h1>
          <p className="text-sm text-[#555555] mt-1">Real-time monitoring overview</p>
        </div>
        <button
          onClick={handleQuickAlert}
          disabled={sendingAlert}
          className="flex items-center gap-2 bg-[#ff4444] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e03c3c] transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bell size={16} />
          {sendingAlert ? 'Broadcasting...' : 'Emergency Alert'}
        </button>
      </div>

      {/* Alert banners */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <AlertBanner key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#141414] border border-[#222222] rounded-xl p-5 transition-all duration-200 hover:bg-[#181818] hover:border-[#2a2a2a]">
            <kpi.icon size={20} className="text-[#00ff88] mb-3" />
            <p className="text-2xl font-bold text-[#f0f0f0]">{kpi.value}</p>
            <p className="text-sm text-[#888888] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid: Sensors (2/3) + Gauge (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sensor cards grid */}
        <div className="lg:col-span-2">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Live Sensors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(sensors || []).map(sensor => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </div>

        {/* Temperature gauge */}
        <div className="space-y-5">
          <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
            <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Temperature</h2>
            <TemperatureGauge value={avgTemp} max={100} />
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#f0f0f0] text-base font-semibold">Activity</h2>
            <div className="flex gap-1">
              {['Day', 'Week', 'Month'].map(period => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                    chartPeriod === period
                      ? 'bg-[#00ff88] text-black'
                      : 'bg-[#1e1e1e] text-[#888888] hover:text-[#f0f0f0]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ChartWidget data={mockChartData} title="" dataKey="temperature" color="#00ff88" />
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <ChartWidget data={mockChartData} title="Air Quality" dataKey="temperature" color="#00ff88" />
        </div>
      </div>
    </div>
  );
}
