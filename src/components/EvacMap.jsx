export function EvacMap() {
  return (
    <div className="bg-gray-200 rounded-lg p-8 h-96 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 text-lg">Building Evacuation Map</p>
        <p className="text-gray-500 text-sm mt-2">Interactive map will be rendered here</p>
        <svg className="w-64 h-48 mx-auto mt-4" viewBox="0 0 200 150">
          <rect x="10" y="10" width="180" height="130" fill="none" stroke="#666" strokeWidth="2"/>
          <circle cx="50" cy="50" r="8" fill="#ef4444"/>
          <circle cx="150" cy="50" r="8" fill="#22c55e"/>
          <circle cx="100" cy="100" r="8" fill="#eab308"/>
          <text x="50" y="70" fontSize="12" textAnchor="middle">Fire</text>
          <text x="150" y="70" fontSize="12" textAnchor="middle">Exit</text>
          <text x="100" y="120" fontSize="12" textAnchor="middle">Assembly</text>
        </svg>
      </div>
    </div>
  );
}
