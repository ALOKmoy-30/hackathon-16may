import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { AlertTriangle } from 'lucide-react';

const zones = {
  lab: { id: 'lab', name: 'Lab', x: 50, y: 50, width: 150, height: 100 },
  hallway: { id: 'hallway', name: 'Hallway', x: 220, y: 50, width: 100, height: 250 },
  office: { id: 'office', name: 'Office', x: 50, y: 170, width: 150, height: 130 },
  exit: { id: 'exit', name: 'Exit', x: 340, y: 150, width: 80, height: 80 },
};

const nodes = {
  lab: { x: 125, y: 100, zone: 'lab' },
  hallway_top: { x: 270, y: 100, zone: 'hallway' },
  hallway_mid: { x: 270, y: 175, zone: 'hallway' },
  office: { x: 125, y: 235, zone: 'office' },
  exit: { x: 380, y: 190, zone: 'exit' },
};

const routingTable = {
  default: ['lab', 'hallway_top', 'hallway_mid', 'exit'],
  hallway_blocked: ['lab', 'office', 'exit'],
  lab_blocked: ['office', 'exit'],
};

export function EvacuationPathsMap() {
  const { sensors, setSensors } = useContext(AppContext);
  const [dangerLevels, setDangerLevels] = useState({ lab: 0, hallway: 0, office: 0, exit: 0 });
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    const levels = { lab: 0, hallway: 0, office: 0, exit: 0 };
    const zoneMapping = { 1: 'lab', 2: 'hallway', 3: 'office', 4: 'hallway', 5: 'office', 6: 'lab' };

    sensors.forEach(sensor => {
      const zone = zoneMapping[sensor.id];
      if (zone) {
        const sensorDanger = Math.max(sensor.smokeLevel || 0, sensor.gasLevel || 0);
        levels[zone] = Math.max(levels[zone], sensorDanger);
      }
    });

    setDangerLevels(levels);
    let pathKey = levels.hallway > 70 ? 'hallway_blocked' : levels.lab > 70 ? 'lab_blocked' : 'default';
    setCurrentPath(routingTable[pathKey]);
  }, [sensors]);

  const toggleTestHazard = (zoneId) => {
    setSensors(prev => prev.map(s => {
      const mappedZone = { 1: 'lab', 2: 'hallway', 3: 'office', 4: 'hallway', 5: 'office', 6: 'lab' }[s.id];
      if (mappedZone === zoneId) {
        const danger = Math.max(s.smokeLevel || 0, s.gasLevel || 0) > 0 ? 0 : 85;
        return { ...s, smokeLevel: danger, gasLevel: danger };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
        <h3 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Simulation Controls</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(zones).filter(([id]) => id !== 'exit').map(([id, zone]) => (
            <button
              key={id}
              onClick={() => toggleTestHazard(id)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                dangerLevels[id] > 70 ? 'bg-red-500 text-white shadow-[0_5px_15px_rgba(239,68,68,0.4)]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {zone.name} {dangerLevels[id] > 70 ? '(!) Active' : 'Normal'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <AlertTriangle className="text-red-500 glow-crimson" size={28} />
          <h3 className="text-2xl font-black tracking-tight text-white">Live Intelligence Map</h3>
        </div>

        <div className="relative aspect-[4/3] w-full max-w-4xl mx-auto">
          <svg viewBox="0 0 450 320" className="w-full h-full drop-shadow-2xl">
            {Object.entries(zones).map(([id, zone]) => {
              const level = dangerLevels[id] || 0;
              const isDanger = level > 70;
              return (
                <g key={id}>
                  <rect
                    x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                    fill={isDanger ? '#7F1D1D' : '#171717'}
                    stroke={isDanger ? '#EF4444' : '#404040'}
                    strokeWidth={isDanger ? 3 : 2}
                  />
                  <text
                    x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 10}
                    textAnchor="middle" dominantBaseline="middle"
                    className="font-bold" fontSize="16px" fill="white"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
                  >
                    {zone.name.toUpperCase()}
                  </text>
                  <text
                    x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 15}
                    textAnchor="middle" className="font-bold" fontSize="16px" fill="white"
                    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
                  >
                    {level}% THREAT
                  </text>
                </g>
              );
            })}

            {currentPath.length > 1 && (
              <path
                d={currentPath.map((nodeId, idx) => {
                  const node = nodes[nodeId];
                  return `${idx === 0 ? 'M' : 'L'} ${node.x} ${node.y}`;
                }).join(' ')}
                stroke="#10B981" strokeWidth="5" strokeDasharray="10,5" fill="none"
                className="glow-emerald" strokeLinecap="round"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
