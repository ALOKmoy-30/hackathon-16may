import { useState } from 'react';

// Floor plan data (1 Floor, 3 Rooms)
const rooms = [
  { id: 'Room1', name: 'Room 1', x: 20, y: 20, width: 140, height: 90, sensorIds: [1, 2, 7, 8] },
  { id: 'Room2', name: 'Room 2', x: 20, y: 130, width: 140, height: 90, sensorIds: [3, 4, 9, 10] },
  { id: 'MainHall', name: 'Main Hall', x: 180, y: 20, width: 100, height: 200, sensorIds: [5, 6, 11, 12] },
];

// Exit locations
const exits = [
  { id: 'exit1', x: 230, y: 10, label: 'Exit (Top)' },
  { id: 'exit2', x: 230, y: 230, label: 'Exit (Bottom)' },
  { id: 'exit3', x: 10, y: 120, label: 'Exit (Left)' },
];

export function FloorPlan({ sensors = [] }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Get all sensors for a room
  const getSensorsForRoom = (room) => {
    return room.sensorIds.map(id => sensors.find(s => s.id === id)).filter(Boolean);
  };

  // Get room color based on sensor status
  const getRoomColor = (room) => {
    const roomSensors = getSensorsForRoom(room);
    
    if (roomSensors.some(s => s.status === 'DANGER')) return '#ef4444'; // red
    if (roomSensors.some(s => s.status === 'WARNING')) return '#f59e0b'; // yellow
    return '#22c55e'; // green
  };

  // Generate evacuation path routing to the closest exit
  const getEvacuationPath = (room) => {
    const isDanger = getSensorsForRoom(room).some(s => s.status === 'DANGER');

    const startX = room.x + room.width / 2;
    const startY = room.y + room.height / 2;

    let exit;
    if (room.id === 'Room1') {
      exit = isDanger ? exits[0] : exits[2]; // Route to Top Exit or Left Exit
    } else if (room.id === 'Room2') {
      exit = isDanger ? exits[1] : exits[2]; // Route to Bottom Exit or Left Exit
    } else { // Main Hall
      exit = isDanger ? exits[1] : exits[0];
    }

    // Path logic
    if (exit.id === 'exit3') {
      return `M ${startX} ${startY} L ${startX} ${exit.y} L ${exit.x} ${exit.y}`;
    } else {
      return `M ${startX} ${startY} L ${exit.x} ${startY} L ${exit.x} ${exit.y}`;
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const selectedSensors = selectedRoom ? getSensorsForRoom(selectedRoom) : [];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Floor Plan */}
        <div className="lg:col-span-2">
          <svg
            viewBox="0 0 300 240"
            className="w-full h-auto border border-gray-300 rounded-lg bg-gray-50"
            style={{ maxHeight: '500px' }}
          >
            {/* Rooms */}
            {rooms.map((room) => (
              <g key={room.id}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={getRoomColor(room)}
                  fillOpacity="0.3"
                  stroke={getRoomColor(room)}
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={() => handleRoomClick(room)}
                />
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2 - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold pointer-events-none"
                  fill="#333"
                >
                  {room.name}
                </text>

                {/* 4 Sensor dots per room */}
                <circle cx={room.x + room.width / 2 - 15} cy={room.y + room.height / 2 + 15} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1" className="pointer-events-none" />
                <circle cx={room.x + room.width / 2 + 15} cy={room.y + room.height / 2 + 15} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1" className="pointer-events-none" />
                <circle cx={room.x + room.width / 2 - 15} cy={room.y + room.height / 2 + 30} r="4" fill="#ef4444" stroke="#fff" strokeWidth="1" className="pointer-events-none" />
                <circle cx={room.x + room.width / 2 + 15} cy={room.y + room.height / 2 + 30} r="4" fill="#ef4444" stroke="#fff" strokeWidth="1" className="pointer-events-none" />
              </g>
            ))}

            {/* Exits */}
            {exits.map((exit) => (
              <g key={exit.id}>
                <rect
                  x={exit.id === 'exit3' ? exit.x - 10 : exit.x - 15}
                  y={exit.id === 'exit3' ? exit.y - 15 : exit.y - 10}
                  width={exit.id === 'exit3' ? 10 : 30}
                  height={exit.id === 'exit3' ? 30 : 10}
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="2"
                />
                <text
                  x={exit.id === 'exit3' ? exit.x - 15 : exit.x}
                  y={exit.id === 'exit3' ? exit.y : (exit.id === 'exit1' ? exit.y - 15 : exit.y + 25)}
                  textAnchor={exit.id === 'exit3' ? "end" : "middle"}
                  dominantBaseline="middle"
                  className="text-[10px] font-bold"
                  fill="#059669"
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
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.8"
                className="pointer-events-none"
              />
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-bold text-sm mb-2">Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Safe Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Danger Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-500 border-dashed rounded"></div>
                <span>Evacuation Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span>Temp Sensor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>Smoke Sensor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-y-auto" style={{ maxHeight: '600px' }}>
          <h3 className="font-bold text-lg mb-3">Zone Information</h3>
          {selectedRoom ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Selected Zone</p>
                <p className="font-black text-2xl">{selectedRoom.name}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200">
                  <div className={`w-3 h-3 rounded-full ${getRoomColor(selectedRoom) === '#22c55e' ? 'bg-green-500' : getRoomColor(selectedRoom) === '#f59e0b' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  Zone Status
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Node Sensors (4)</p>
                {selectedSensors.map(sensor => (
                  <div key={sensor.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-800 text-sm">{sensor.name}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          sensor.status === 'DANGER'
                            ? 'bg-red-100 text-red-700'
                            : sensor.status === 'WARNING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {sensor.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Temp</p>
                        <p className="text-sm font-semibold">{sensor.temperature || 0}°C</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Smoke</p>
                        <p className="text-sm font-semibold">{sensor.smokeLevel || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              <p className="text-sm font-medium">Click on a zone to view</p>
              <p className="text-xs mt-1">live telemetry from its sensors</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
