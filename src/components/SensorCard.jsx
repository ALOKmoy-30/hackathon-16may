import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function SensorCard({ sensor }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'WARNING':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'NORMAL':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      DANGER: 'bg-red-600 text-white',
      WARNING: 'bg-yellow-600 text-white',
      NORMAL: 'bg-green-600 text-white',
    };
    return colors[status] || 'bg-gray-600 text-white';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusColor(sensor.status)}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{sensor.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(sensor.status)}`}>
          {sensor.status}
        </span>
      </div>
      <p className="text-sm mb-1">Location: {sensor.location}</p>
      <p className="text-sm mb-1">Temperature: {sensor.temperature}°C</p>
      <p className="text-sm mb-3">Smoke Level: {sensor.smokeLevel}%</p>

      {/* Sparkline chart */}
      {sensor.history && sensor.history.length > 0 && (
        <div className="mt-2 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensor.history}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={sensor.status === 'DANGER' ? '#dc2626' : sensor.status === 'WARNING' ? '#d97706' : '#16a34a'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
