import { EvacuationPathsMap } from '../components/EvacuationPathsMap.jsx';

export function EvacuationPaths() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Evacuation Paths</h1>
      <EvacuationPathsMap />
    </div>
  );
}
