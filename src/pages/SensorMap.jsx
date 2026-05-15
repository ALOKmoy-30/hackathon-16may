import { useSensors } from '../hooks/useSensors.jsx';
import { SensorCard } from '../components/SensorCard.jsx';

export function SensorMap() {
  const { sensors, loading } = useSensors();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Sensor Map</h1>

      {loading ? (
        <p>Loading sensors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}
    </div>
  );
}
