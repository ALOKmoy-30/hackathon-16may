import { EvacuationPathsMap } from '../components/EvacuationPathsMap.jsx';

export function EvacuationPaths() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Evacuation Paths</h1>
        <p className="text-sm text-[#555555] mt-1">Live evacuation routing and zone monitoring</p>
      </div>
      <EvacuationPathsMap />
    </div>
  );
}
