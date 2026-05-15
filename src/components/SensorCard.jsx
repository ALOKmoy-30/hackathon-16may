export function SensorCard({ sensor }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'normal':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusColor(sensor.status)}`}>
      <h3 className="font-bold text-lg">{sensor.name}</h3>
      <p className="text-sm">Location: {sensor.location}</p>
      <p className="text-sm">Temperature: {sensor.temperature}°C</p>
      <p className="text-sm">Smoke Level: {sensor.smokeLevel}%</p>
      <p className="text-xs mt-2 capitalize">Status: {sensor.status}</p>
    </div>
  );
}
