import { EvacMap } from '../components/EvacMap.jsx';

export function EvacuationPaths() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Evacuation Paths</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EvacMap />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Evacuation Routes</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Primary Exit - North Stairwell</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>Secondary Exit - South Corridor</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span>Assembly Point - Parking Lot</span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2">Estimated Evacuation Time</h3>
            <p className="text-2xl font-bold text-blue-600">4 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
