import { useSensors } from '../hooks/useSensors.jsx';
import { FloorPlan } from '../components/FloorPlan.jsx';

export function SensorMap() {
  const { sensors, loading } = useSensors();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Sensor Map</h1>
        <p className="text-sm text-[#555555] mt-1">Interactive floor plan with live sensor data</p>
      </div>

      {loading ? (
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00ff88] border-t-transparent" />
        </div>
      ) : (
        <FloorPlan sensors={sensors} />
      )}
    </div>
  );
}
