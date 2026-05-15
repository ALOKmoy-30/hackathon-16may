import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { AlertTriangle } from 'lucide-react';

// Define zones and simplified nodes for routing
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

// Simplified routing table
const routingTable = {
  default: ['lab', 'hallway_top', 'hallway_mid', 'exit'],
  hallway_blocked: ['lab', 'office', 'exit'], // Alternative route
  lab_blocked: ['office', 'exit'], // If lab blocked, route starts from office
};

// Helper to calculate danger percentage
const calculateDangerPercentage = (value, max) =>
  Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

export function EvacuationPathsMap() {
  const { sensors, setSensors } = useContext(AppContext);
  const [dangerLevels, setDangerLevels] = useState({
    lab: 0,
    hallway: 0,
    office: 0,
    exit: 0,
  });
  const [currentPath, setCurrentPath] = useState([]);

  // Calculate danger levels and determine path
  useEffect(() => {
    const levels = {
      lab: 0,
      hallway: 0,
      office: 0,
      exit: 0,
    };

    // Map sensors to zones (simplified mapping based on sensor ID)
    const zoneMapping = {
      1: 'lab', // Sensor A -> Lab
      2: 'hallway', // Sensor B -> Hallway
      3: 'office', // Sensor C -> Office
      4: 'hallway', // Sensor D -> Hallway
      5: 'office', // Sensor E -> Office
      6: 'lab', // Sensor F -> Lab
    };

    // Aggregate sensor data for danger levels
    sensors.forEach(sensor => {
      const zone = zoneMapping[sensor.id];
      if (zone) {
        const sensorDanger = Math.max(
          sensor.smokeLevel || 0,
          sensor.gasLevel || 0
        );
        levels[zone] = Math.max(levels[zone], sensorDanger);
      }
    });

    setDangerLevels(levels);

    // Determine current path based on danger levels
    let pathKey = 'default';
    if (levels.hallway > 70) {
      pathKey = 'hallway_blocked';
    } else if (levels.lab > 70) {
      pathKey = 'lab_blocked';
    }
    setCurrentPath(routingTable[pathKey].map(zoneId => nodes[zoneId] ? zoneId : null).filter(Boolean));
  }, [sensors]);

  // Toggle test hazard for a specific zone
  const toggleTestHazard = (zoneId) => {
    setSensors(prevSensors => {
      const updatedSensors = prevSensors.map(sensor => {
        const mappedZone = {
          1: 'lab',
          2: 'hallway',
          3: 'office',
          4: 'hallway',
          5: 'office',
          6: 'lab',
        }[sensor.id];

        if (mappedZone === zoneId) {
          const currentDanger = Math.max(sensor.smokeLevel || 0, sensor.gasLevel || 0);
          const newDanger = currentDanger > 0 ? 0 : 85; // Toggle between 0 and 85%
          return {
            ...sensor,
            smokeLevel: newDanger,
            gasLevel: newDanger,
          };
        }
        return sensor;
      });
      return updatedSensors;
    });
  };

  // Get zone color based on its specific danger level
  const getZoneColor = (zoneId) => {
    const level = dangerLevels[zoneId] || 0;
    if (level > 70) return '#ef4444'; // Red - High Risk
    if (level > 40) return '#f59e0b'; // Yellow - Warning
    return '#22c55e'; // Green - Safe
  };

  // Get evacuation instructions based on blocked zones
  const getEvacuationInstructions = () => {
    const blockedZones = Object.entries(dangerLevels)
      .filter(([zoneId, level]) => zoneId !== 'exit' && level > 70)
      .map(([zoneId]) => zones[zoneId]?.name);

    if (blockedZones.length === 0) {
      return 'All routes clear - Proceed to nearest exit';
    }

    if (dangerLevels.hallway > 70) {
      return 'Hallway Blocked - Proceed via Office to Exit';
    }
    if (dangerLevels.lab > 70) {
      return 'Lab Blocked - Use alternative route through Hallway';
    }

    return 'Follow green safe path to exit';
  };

  return (
    <div className="space-y-4">
      {/* Test Hazard Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-3">Test Hazard Simulation</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(zones).filter(([id]) => id !== 'exit').map(([id, zone]) => {
            const currentZoneDanger = dangerLevels[id] || 0;
            return (
              <button
                key={id}
                onClick={() => toggleTestHazard(id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  currentZoneDanger > 0
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {zone.name} {currentZoneDanger > 0 ? '(Hazard Active)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Evacuation Status Panel */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="font-bold text-lg">Live Evacuation Status</h3>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <p className="font-semibold text-blue-900">{getEvacuationInstructions()}</p>
        </div>

        {/* Zone Status - Each zone evaluated independently */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(zones).filter(([id]) => id !== 'exit').map(([id, zone]) => {
            const level = dangerLevels[id] || 0;
            const status = level > 70 ? 'High Risk' : level > 40 ? 'Warning' : 'Safe';
            return (
              <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{zone.name}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    level > 70
                      ? 'bg-red-600 text-white'
                      : level > 40
                      ? 'bg-yellow-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {status} ({calculateDangerPercentage(level, 100)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Floor Plan */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-3">Evacuation Map</h3>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto max-w-3xl mx-auto border border-gray-300 rounded-lg bg-gray-50"
        >
          {/* Draw zones - each evaluated independently */}
          {Object.entries(zones).map(([id, zone]) => {
            const zoneColor = getZoneColor(id);
            const zoneDanger = dangerLevels[id] || 0;

            return (
              <g key={id}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill={zoneColor}
                  fillOpacity="0.3"
                  stroke={zoneColor}
                  strokeWidth="3"
                />
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold"
                  fill="#333"
                >
                  {zone.name}
                </text>
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold"
                  fill="#555"
                >
                  ({calculateDangerPercentage(zoneDanger, 100)}%)
                </text>
                {zoneDanger > 70 && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 30}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill="#dc2626"
                  >
                    HIGH RISK
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw safe path */}
          {currentPath.length > 1 && (
            <path
              d={currentPath
                .map((nodeId, idx) => {
                  const node = nodes[nodeId];
                  return `${idx === 0 ? 'M' : 'L'} ${node.x} ${node.y}`;
                })
                .join(' ')}
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray="8,4"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
            </marker>
          </defs>

          {/* Draw nodes */}
          {Object.entries(nodes).map(([id, node]) => (
            <circle
              key={id}
              cx={node.x}
              cy={node.y}
              r="6"
              fill={currentPath.includes(id) ? '#22c55e' : '#94a3b8'}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 border-dashed rounded"></div>
            <span>Safe Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
