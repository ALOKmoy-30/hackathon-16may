import { useState } from 'react';
import { StatusBadge } from './ui/StatusBadge.jsx';

// Floor plan data (1 Floor, 3 Rooms)
const rooms = [
  { id: 'Room1', name: 'Room 1', x: 50, y: 50, width: 350, height: 180, sensorIds: [1, 2, 7, 8] },
  { id: 'Room2', name: 'Room 2', x: 50, y: 270, width: 350, height: 180, sensorIds: [3, 4, 9, 10] },
  { id: 'MainHall', name: 'Main Hall', x: 450, y: 50, width: 300, height: 400, sensorIds: [5, 6, 11, 12] },
];

// Exit locations
const exits = [
  { id: 'exit1', x: 550, y: 20, label: 'Exit (Top)' },
  { id: 'exit2', x: 550, y: 450, label: 'Exit (Bottom)' },
  { id: 'exit3', x: 20, y: 235, label: 'Exit (Left)' },
];

export function FloorPlan({ sensors = [] }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Get all sensors for a room
  const getSensorsForRoom = (room) => {
    return room.sensorIds.map(id => sensors.find(s => s.id === id)).filter(Boolean);
  };

  // Get room status
  const getRoomStatus = (room) => {
    const roomSensors = getSensorsForRoom(room);
    if (roomSensors.some(s => s.status === 'DANGER')) return 'danger';
    if (roomSensors.some(s => s.status === 'WARNING')) return 'warning';
    return 'safe';
  };

  // Generate evacuation path routing to the closest exit
  const getEvacuationPath = (room) => {
    const isDanger = getSensorsForRoom(room).some(s => s.status === 'DANGER');
    const startX = room.x + room.width / 2;
    const startY = room.y + room.height / 2;

    let exit;
    if (room.id === 'Room1') {
      exit = isDanger ? exits[0] : exits[2];
    } else if (room.id === 'Room2') {
      exit = isDanger ? exits[1] : exits[2];
    } else {
      exit = isDanger ? exits[1] : exits[0];
    }

    if (exit.id === 'exit3') {
      const exitCenterY = exit.y + 30;
      return `M ${startX} ${startY} L ${startX} ${exitCenterY} L ${exit.x} ${exitCenterY}`;
    } else {
      const exitCenterX = exit.x + 50;
      return `M ${startX} ${startY} L ${exitCenterX} ${startY} L ${exitCenterX} ${exit.y}`;
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const selectedSensors = selectedRoom ? getSensorsForRoom(selectedRoom) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* SVG Floor Plan */}
      <div className="lg:col-span-2">
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <div className="w-full" style={{ aspectRatio: '8/5' }}>
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Rooms */}
              {rooms.map((room) => {
                const status = getRoomStatus(room);
                const isDanger = status === 'danger';
                return (
                  <g key={room.id}>
                    <rect
                      x={room.x} y={room.y}
                      width={room.width} height={room.height}
                      fill={isDanger ? '#1f0000' : '#1a1a1a'}
                      stroke={isDanger ? '#ff4444' : '#333333'}
                      strokeWidth={isDanger ? 3 : 2}
                      className="cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room)}
                    />
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2 - 10}
                      textAnchor="middle" dominantBaseline="middle"
                      className="text-lg font-semibold pointer-events-none"
                      fill={isDanger ? '#ff4444' : '#555555'}
                    >
                      {room.name}
                    </text>

                    {/* Sensor dots */}
                    {getSensorsForRoom(room).map((sensor, idx) => {
                      const dotX = room.x + room.width / 2 + (idx % 2 === 0 ? -40 : 40);
                      const dotY = room.y + room.height / 2 + (idx < 2 ? 20 : 50);
                      const dotColor = sensor.status === 'DANGER' ? '#ff4444'
                        : sensor.status === 'WARNING' ? '#ffaa00'
                        : '#00ff88';
                      return (
                        <circle
                          key={sensor.id}
                          cx={dotX} cy={dotY} r="8"
                          fill={dotColor}
                          className="pointer-events-none"
                          opacity="0.9"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Exits */}
              {exits.map((exit) => (
                <g key={exit.id}>
                  <rect
                    x={exit.x} y={exit.y}
                    width={exit.id === 'exit3' ? 30 : 100}
                    height={exit.id === 'exit3' ? 60 : 30}
                    fill="#0a1f0f"
                    stroke="#00ff88"
                    strokeWidth="2"
                  />
                  <text
                    x={exit.id === 'exit3' ? exit.x - 15 : exit.x + 50}
                    y={exit.id === 'exit3' ? exit.y + 30 : (exit.id === 'exit1' ? exit.y - 15 : exit.y + 45)}
                    textAnchor={exit.id === 'exit3' ? "end" : "middle"}
                    dominantBaseline="middle"
                    className="text-xs font-semibold uppercase"
                    fill="#00ff88"
                  >
                    {exit.label}
                  </text>
                </g>
              ))}

              {/* Evacuation Paths */}
              {rooms.map((room) => (
                <path
                  key={`path-${room.id}`}
                  d={getEvacuationPath(room)}
                  stroke="#00ff88"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  fill="none"
                  opacity="0.7"
                  className="pointer-events-none"
                  style={{ animation: 'dash 1.5s linear infinite' }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-4 mt-4">
          <div className="flex flex-wrap gap-4 text-xs text-[#888888]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1a1a1a] border border-[#333333] rounded-sm" />
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1f0000] border border-[#ff4444] rounded-sm" />
              <span>Danger Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
              <span>Normal Sensor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff4444]" />
              <span>Critical Sensor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-dashed border-[#00ff88] rounded-sm" />
              <span>Evacuation Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 overflow-y-auto" style={{ maxHeight: '600px' }}>
        <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">Zone Information</h3>
        {selectedRoom ? (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#222222]">
              <p className="text-xs text-[#888888] uppercase tracking-wide mb-1">Selected Zone</p>
              <p className="text-xl font-bold text-[#f0f0f0]">{selectedRoom.name}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#888888] uppercase tracking-wide">Sensors ({selectedSensors.length})</p>
              {selectedSensors.map(sensor => (
                <div key={sensor.id} className="bg-[#0f0f0f] border border-[#222222] rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-[#f0f0f0]">{sensor.name}</p>
                    <StatusBadge status={sensor.status || 'NORMAL'} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-[#141414] rounded p-2">
                      <p className="text-[10px] text-[#555555] uppercase">Temp</p>
                      <p className="text-sm text-[#f0f0f0]">{sensor.temperature || 0}°C</p>
                    </div>
                    <div className="bg-[#141414] rounded p-2">
                      <p className="text-[10px] text-[#555555] uppercase">Smoke</p>
                      <p className="text-sm text-[#f0f0f0]">{sensor.smokeLevel || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[#555555]">
            <p className="text-sm">Click on a zone to view</p>
            <p className="text-xs mt-1 text-[#555555]">live telemetry from its sensors</p>
          </div>
        )}
      </div>
    </div>
  );
}
