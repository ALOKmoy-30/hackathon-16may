import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

const zones = {
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
  const { sensors, setSensors } = useContext(AppContext);
  const [dangerLevels, setDangerLevels] = useState({ room1: 0, room2: 0, mainHall: 0 });
  const [activeFloor, setActiveFloor] = useState(0);

  useEffect(() => {
    const levels = { room1: 0, room2: 0, mainHall: 0 };
    const zoneMapping = { 
      1: 'room1', 2: 'room1', 7: 'room1', 8: 'room1',
      3: 'room2', 4: 'room2', 9: 'room2', 10: 'room2',
      5: 'mainHall', 6: 'mainHall', 11: 'mainHall', 12: 'mainHall'
    };

    sensors.forEach(sensor => {
      const zone = zoneMapping[sensor.id];
      if (zone) {
        const sensorDanger = Math.max(sensor.smokeLevel || 0, sensor.gasLevel || 0);
        levels[zone] = Math.max(levels[zone], sensorDanger);
      }
    });

    setDangerLevels(levels);
  }, [sensors]);

  const toggleTestHazard = (zoneId) => {
    setSensors(prev => prev.map(s => {
      const mappedZone = { 
        1: 'room1', 2: 'room1', 7: 'room1', 8: 'room1',
        3: 'room2', 4: 'room2', 9: 'room2', 10: 'room2',
        5: 'mainHall', 6: 'mainHall', 11: 'mainHall', 12: 'mainHall'
      }[s.id];
      
      if (mappedZone === zoneId && s.name.includes('Smoke')) {
        const danger = Math.max(s.smokeLevel || 0, s.gasLevel || 0) > 0 ? 0 : 85;
        return { ...s, smokeLevel: danger, gasLevel: danger, status: danger > 0 ? 'DANGER' : 'NORMAL' };
      }
      return s;
    }));
  };

  const getEvacuationPath = (zoneId) => {
    const zone = zones[zoneId];
    const isDanger = dangerLevels[zoneId] > 70;
    
    const startX = zone.x + zone.width / 2;
    const startY = zone.y + zone.height / 2;

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
      {/* Floor tabs + Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Floor tabs */}
        <div className="bg-[#0f0f0f] rounded-lg p-1 inline-flex gap-1">
          {floors.map((floor, idx) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(idx)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeFloor === idx
                  ? 'bg-[#141414] text-[#00ff88]'
                  : 'text-[#888888] hover:text-[#f0f0f0]'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* Simulation buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(zones).map(([id, zone]) => (
            <button
              key={id}
              onClick={() => toggleTestHazard(id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 active:scale-95 ${
                dangerLevels[id] > 70
                  ? 'border border-[#ff4444]/30 text-[#ff4444] hover:bg-[#ff4444]/10'
                  : 'border border-[#222222] text-[#888888] hover:text-[#f0f0f0] hover:border-[#333333]'
              }`}
            >
              {zone.name} {dangerLevels[id] > 70 ? '⚠ Active' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Info panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Map */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#222222] rounded-xl p-5">
          <div className="w-full" style={{ aspectRatio: '8/5' }}>
            <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Corridor background */}
              <rect x="400" y="50" width="50" height="400" fill="#111111" stroke="#222222" strokeWidth="1" />

              {Object.entries(zones).map(([id, zone]) => {
                const level = dangerLevels[id] || 0;
                const isDanger = level > 70;
                return (
                  <g key={id}>
                    <rect
                      x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                      fill={isDanger ? '#1f0000' : '#1a1a1a'}
                      stroke={isDanger ? '#ff4444' : '#333333'}
                      strokeWidth={isDanger ? 3 : 2}
                    />
                    <text
                      x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 10}
                      textAnchor="middle" dominantBaseline="middle"
                      className="text-lg font-semibold" fill={isDanger ? '#ff4444' : '#555555'}
                    >
                      {zone.name}
                    </text>
                    <text
                      x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 15}
                      textAnchor="middle" className="text-sm" fill={isDanger ? '#ff4444' : '#555555'}
                    >
                      {level}% Threat
                    </text>

                    {/* Sensor dots */}
                    <circle cx={zone.x + zone.width/2 - 30} cy={zone.y + zone.height/2 + 40} r="6"
                      fill={isDanger ? '#ff4444' : '#00ff88'} />
                    <circle cx={zone.x + zone.width/2 + 30} cy={zone.y + zone.height/2 + 40} r="6"
                      fill={level > 30 ? '#ffaa00' : '#00ff88'} />
                  </g>
                );
              })}

              {exits.map((exit) => (
                <g key={exit.id}>
                  <rect
                    x={exit.x} y={exit.y}
                    width={exit.width} height={exit.height}
                    fill="#0a1f0f"
                    stroke="#00ff88"
                    strokeWidth="2"
                  />
                  <text
                    x={exit.id === 'exitLeft' ? exit.x - 10 : exit.x + exit.width / 2}
                    y={exit.id === 'exitLeft' ? exit.y + exit.height / 2 : (exit.id === 'exitTop' ? exit.y - 10 : exit.y + exit.height + 15)}
                    textAnchor={exit.id === 'exitLeft' ? "end" : "middle"}
                    dominantBaseline="middle"
                    className="text-xs font-semibold uppercase"
                    fill="#00ff88"
                  >
                    {exit.label}
                  </text>
                </g>
              ))}

              {Object.keys(zones).map((zoneId) => (
                <path
                  key={`path-${zoneId}`}
                  d={getEvacuationPath(zoneId)}
                  stroke="#00ff88"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  fill="none"
                  opacity="0.7"
                  strokeLinecap="round"
                  style={{ animation: 'dash 1.5s linear infinite' }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">Zone Status</h3>
          <div className="space-y-3">
            {Object.entries(zones).map(([id, zone]) => {
              const level = dangerLevels[id] || 0;
              const isDanger = level > 70;
              return (
                <div key={id} className={`bg-[#0f0f0f] border rounded-lg p-3 ${isDanger ? 'border-[#ff4444]/30' : 'border-[#222222]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#f0f0f0]">{zone.name}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                      isDanger
                        ? 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20'
                        : level > 30
                        ? 'bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20'
                        : 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20'
                    }`}>
                      {isDanger ? 'DANGER' : level > 30 ? 'WARNING' : 'SAFE'}
                    </span>
                  </div>
                  <p className="text-sm text-[#888888]">Threat Level: {level}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
