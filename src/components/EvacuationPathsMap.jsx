import { useEvacuation } from '../hooks/useEvacuation.js';

const zonesData = {
  room1: { id: 'room1', name: 'Room 1', x: 50, y: 50, width: 350, height: 180 },
  room2: { id: 'room2', name: 'Room 2', x: 50, y: 270, width: 350, height: 180 },
  mainHall: { id: 'mainHall', name: 'Main Hall', x: 450, y: 50, width: 300, height: 400 },
};

const exits = [
  { id: 'exitTop', x: 550, y: 20, width: 100, height: 30, label: 'EXIT' },
  { id: 'exitBottom', x: 550, y: 450, width: 100, height: 30, label: 'EXIT' },
  { id: 'exitLeft', x: 20, y: 235, width: 30, height: 60, label: 'EXIT' },
];

const floors = ['Floor 1', 'Floor 2', 'Floor 3'];

export function EvacuationPathsMap() {
  const {
    selectedZone, setSelectedZone,
    currentFloor, setCurrentFloor,
    route,
    manualRiskMap,
    isSimulating,
    simulationStep,
    ignitionNode,
    hasSimulated,
    blockNode,
    unblockNode,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetToNormal,
    simulationSpeed,
    setSimulationSpeed
  } = useEvacuation();

  const getEvacuationPath = (zoneId) => {
    const zone = zonesData[zoneId];
    if (!zone) return "";

    const startX = zone.x + zone.width / 2;
    const startY = zone.y + zone.height / 2;

    const routeForZone = selectedZone ? (selectedZone === zoneId ? route : []) : route;
    // If we only show route for selected zone or all zones
    const isDanger = (manualRiskMap[zoneId] || 0) > 70;
    
    let exit;
    if (zoneId === 'room1') {
      exit = isDanger ? exits[0] : exits[2];
    } else if (zoneId === 'room2') {
      exit = isDanger ? exits[1] : exits[2];
    } else {
      exit = isDanger ? exits[1] : exits[0];
    }

    if (exit.id === 'exitLeft') {
      const exitCenterY = exit.y + 30;
      return `M ${startX} ${startY} L ${startX} ${exitCenterY} L ${exit.x} ${exitCenterY}`;
    } else {
      const exitCenterX = exit.x + 50;
      return `M ${startX} ${startY} L ${exitCenterX} ${startY} L ${exitCenterX} ${exit.y}`;
    }
  };

  return (
    <div className="space-y-5">
      {/* Floor tabs + Speed Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Floor tabs */}
        <div className="bg-[#0f0f0f] rounded-lg p-1 inline-flex gap-1">
          {floors.map((floor, idx) => (
            <button
              key={floor}
              onClick={() => setCurrentFloor(idx + 1)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentFloor === idx + 1
                  ? 'bg-[#141414] text-[#00ff88]'
                  : 'text-[#888888] hover:text-[#f0f0f0]'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* Speed Controls */}
        {isSimulating && (
          <div className="flex bg-[#0f0f0f] rounded-lg p-1">
            <span className="px-3 py-1.5 text-sm text-[#555555] font-medium">Speed:</span>
            {[1500, 750, 300].map((speed, i) => {
              const labels = ['1x', '2x', '5x'];
              return (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors duration-200 ${
                    simulationSpeed === speed
                      ? 'bg-[#141414] text-[#00ff88]'
                      : 'text-[#888888] hover:text-[#f0f0f0]'
                  }`}
                >
                  {labels[i]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map + Info panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Map */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#222222] rounded-xl p-5 overflow-hidden">
          {/* Changed minHeight or removed fixed height to ensure fit */}
          <div className="w-full relative" style={{ paddingBottom: '62.5%' }}>
            <svg 
              viewBox="0 0 800 500" 
              className="absolute top-0 left-0 w-full h-full" 
              preserveAspectRatio="xMidYMid meet"
            >
              <rect x="400" y="50" width="50" height="400" fill="#111111" stroke="#222222" strokeWidth="1" />

              {Object.entries(zonesData).map(([id, zone]) => {
                const level = manualRiskMap[id] || 0;
                const isDanger = level > 70;
                const isSelected = selectedZone === id;

                return (
                  <g 
                    key={id} 
                    onClick={() => setSelectedZone(isSelected ? null : id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                      fill={isDanger ? '#1f0000' : isSelected ? '#1a2b1f' : '#1a1a1a'}
                      stroke={isDanger ? '#ff4444' : isSelected ? '#00ff88' : '#333333'}
                      strokeWidth={isDanger || isSelected ? 3 : 2}
                      className="transition-colors duration-300"
                    />
                    <text
                      x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 10}
                      textAnchor="middle" dominantBaseline="middle"
                      className="text-lg font-semibold pointer-events-none" fill={isDanger ? '#ff4444' : isSelected ? '#00ff88' : '#555555'}
                    >
                      {zone.name}
                    </text>
                    <text
                      x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 15}
                      textAnchor="middle" className="text-sm pointer-events-none" fill={isDanger ? '#ff4444' : '#555555'}
                    >
                      {level}% Threat
                    </text>

                    <circle cx={zone.x + zone.width/2 - 30} cy={zone.y + zone.height/2 + 40} r="6" fill={isDanger ? '#ff4444' : '#00ff88'} />
                    <circle cx={zone.x + zone.width/2 + 30} cy={zone.y + zone.height/2 + 40} r="6" fill={level > 30 ? '#ffaa00' : '#00ff88'} />
                  </g>
                );
              })}

              {exits.map((exit) => (
                <g key={exit.id}>
                  <rect
                    x={exit.x} y={exit.y} width={exit.width} height={exit.height}
                    fill="#0a1f0f" stroke="#00ff88" strokeWidth="2"
                  />
                  <text
                    x={exit.id === 'exitLeft' ? exit.x - 10 : exit.x + exit.width / 2}
                    y={exit.id === 'exitLeft' ? exit.y + exit.height / 2 : (exit.id === 'exitTop' ? exit.y - 10 : exit.y + exit.height + 15)}
                    textAnchor={exit.id === 'exitLeft' ? "end" : "middle"}
                    dominantBaseline="middle" className="text-xs font-semibold uppercase" fill="#00ff88"
                  >
                    {exit.label}
                  </text>
                </g>
              ))}

              {(selectedZone ? [selectedZone] : Object.keys(zonesData)).map((zoneId) => (
                <path
                  key={`path-${zoneId}`}
                  d={getEvacuationPath(zoneId)}
                  stroke="#00ff88" strokeWidth="3" strokeDasharray="8 4" fill="none" opacity="0.8" strokeLinecap="round"
                  style={{ animation: 'dash 1.5s linear infinite' }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">Simulation Panel</h3>

          <div className="flex-1 space-y-4">
            <div className="text-sm text-[#888888] bg-[#0f0f0f] p-3 rounded-lg border border-[#222222]">
              Select a zone to act as the ignition point.
            </div>

            {/* Zone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#555555] uppercase">Ignition Node</label>
              <select
                value={selectedZone || ''}
                onChange={e => setSelectedZone(e.target.value || null)}
                className="w-full bg-[#0f0f0f] border border-[#333333] text-[#f0f0f0] rounded-lg px-3 py-2 text-sm focus:border-[#00ff88] outline-none"
              >
                <option value="">-- Select a Zone --</option>
                {Object.entries(zonesData).map(([id, zone]) => (
                  <option key={id} value={id}>{zone.name}</option>
                ))}
              </select>
            </div>

            {/* Simulation controls */}
            {selectedZone && (
              <div className="pt-4 border-t border-[#222222] space-y-3">
                {!hasSimulated ? (
                  <button
                    onClick={() => startSimulation(selectedZone)}
                    className="w-full py-2.5 rounded-lg text-sm font-bold bg-[#ff4444] text-white hover:bg-[#e03c3c] transition-colors"
                  >
                    Ignite Fire
                  </button>
                ) : (
                  <>
                    <div className="flex gap-2">
                      {isSimulating ? (
                        <button
                          onClick={pauseSimulation}
                          className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[#333333] text-[#f0f0f0] hover:bg-[#444444]"
                        >
                          Pause
                        </button>
                      ) : simulationStep < 8 ? (
                        <button
                          onClick={resumeSimulation}
                          className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[#00ff88] text-black hover:bg-[#00cc6a]"
                        >
                          Resume
                        </button>
                      ) : null}
                    </div>
                  </>
                )}
                
                {hasSimulated && (!isSimulating || simulationStep >= 8) && (
                  <button
                    onClick={resetToNormal}
                    className="w-full py-2 rounded-lg text-sm font-bold border border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors"
                  >
                    Reset System
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#222222]">
            <p className="text-xs text-[#555555]">
              Step: {simulationStep} / 8 <br/>
              Status: {isSimulating ? 'Simulating...' : hasSimulated ? 'Paused/Ended' : 'Idle'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
