import { useSensors } from '../hooks/useSensors.jsx';
import { FloorPlan } from '../components/FloorPlan.jsx';

export function SensorMap() {
  const { sensors, loading } = useSensors();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Sensor Map</h1>

      {loading ? (
        <p>Loading sensors...</p>
      ) : (
        <FloorPlan sensors={sensors} />
      )}
    </div>
  );
}
