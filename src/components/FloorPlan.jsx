import { useState } from 'react';

// Floor plan data for Floor 1
const floor1Rooms = [
  { id: 'A', name: 'Zone A', x: 20, y: 20, width: 80, height: 60, sensorId: 1 },
  { id: 'B', name: 'Zone B', x: 120, y: 20, width: 80, height: 60, sensorId: 2 },
  { id: 'C', name: 'Zone C', x: 220, y: 20, width: 80, height: 60, sensorId: 3 },
  { id: 'D', name: 'Zone D', x: 20, y: 100, width: 80, height: 60, sensorId: 4 },
  { id: 'E', name: 'Zone E', x: 120, y: 100, width: 80, height: 60, sensorId: 5 },
  { id: 'F', name: 'Zone F', x: 220, y: 100, width: 80, height: 60, sensorId: 6 },
];

// Floor plan data for Floor 2
const floor2Rooms = [
  { id: 'G', name: 'Zone G', x: 20, y: 20, width: 80, height: 60, sensorId: 1 },
  { id: 'H', name: 'Zone H', x: 120, y: 20, width: 80, height: 60, sensorId: 2 },
  { id: 'I', name: 'Zone I', x: 220, y: 20, width: 80, height: 60, sensorId: 3 },
  { id: 'J', name: 'Zone J', x: 20, y: 100, width: 80, height: 60, sensorId: 4 },
  { id: 'K', name: 'Zone K', x: 120, y: 100, width: 80, height: 60, sensorId: 5 },
  { id: 'L', name: 'Zone L', x: 220, y: 100, width: 80, height: 60, sensorId: 6 },
];

// Exit locations
const exits = [
  { x: 320, y: 50, label: 'Exit 1' },
  { x: 320, y: 130, label: 'Exit 2' },
];

export function FloorPlan({ sensors = [] }) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const currentRooms = selectedFloor === 1 ? floor1Rooms : floor2Rooms;

  // Get sensor data for a room
  const getSensorForRoom = (room) => {
    return sensors.find(s => s.id === room.sensorId) || {};
  };

  // Get room color based on sensor status
  const getRoomColor = (room) => {
    const sensor = getSensorForRoom(room);
    const status = sensor.status || 'NORMAL';

    switch (status) {
      case 'DANGER':
        return '#ef4444'; // red
      case 'WARNING':
        return '#f59e0b'; // yellow
      case 'NORMAL':
      default:
        return '#22c55e'; // green
    }
  };

  // Generate evacuation path (simple path avoiding danger zones)
  const getEvacuationPath = (room) => {
    const sensor = getSensorForRoom(room);
    const isDanger = sensor.status === 'DANGER';

    const startX = room.x + room.width / 2;
    const startY = room.y + room.height / 2;

    // Choose exit based on danger status
    const exit = isDanger ? exits[1] : exits[0];

    // Create a path with a waypoint
    const midX = (startX + exit.x) / 2;
    const midY = isDanger ? exit.y : startY;

    return `M ${startX} ${startY} L ${midX} ${midY} L ${exit.x} ${exit.y}`;
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const selectedSensor = selectedRoom ? getSensorForRoom(selectedRoom) : null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Floor Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedFloor(1)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedFloor === 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Floor 1
        </button>
        <button
          onClick={() => setSelectedFloor(2)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedFloor === 2
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Floor 2
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Floor Plan */}
        <div className="lg:col-span-2">
          <svg
            viewBox="0 0 360 180"
            className="w-full h-auto border border-gray-300 rounded-lg bg-gray-50"
            style={{ maxHeight: '500px' }}
          >
            {/* Rooms */}
            {currentRooms.map((room) => (
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
                  y={room.y + room.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold pointer-events-none"
                  fill="#333"
                >
                  {room.name}
                </text>

                {/* Sensor circle */}
                <circle
                  cx={room.x + room.width / 2}
                  cy={room.y + room.height / 2 + 15}
                  r="5"
                  fill={getRoomColor(room)}
                  stroke="#fff"
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              </g>
            ))}

            {/* Exits */}
            {exits.map((exit, idx) => (
              <g key={idx}>
                <rect
                  x={exit.x - 10}
                  y={exit.y - 15}
                  width="20"
                  height="30"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="2"
                />
                <text
                  x={exit.x}
                  y={exit.y + 40}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill="#059669"
                >
                  {exit.label}
                </text>
              </g>
            ))}

            {/* Evacuation Paths */}
            {currentRooms.map((room) => (
              <path
                key={`path-${room.id}`}
                d={getEvacuationPath(room)}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.6"
              />
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-bold text-sm mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
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
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Sensor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-bold text-lg mb-3">Zone Information</h3>
          {selectedRoom && selectedSensor ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Zone</p>
                <p className="font-bold text-lg">{selectedRoom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sensor</p>
                <p className="font-semibold">{selectedSensor.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{selectedSensor.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="font-semibold">{selectedSensor.temperature}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Smoke Level</p>
                <p className="font-semibold">{selectedSensor.smokeLevel} ppm</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedSensor.status === 'DANGER'
                      ? 'bg-red-600 text-white'
                      : selectedSensor.status === 'WARNING'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {selectedSensor.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Click on a room to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
