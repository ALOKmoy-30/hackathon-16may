import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export function ControlPanel() {
  const { addAlert } = useContext(AppContext);
  const [systemStatus, setSystemStatus] = useState('normal');

  const handleTriggerEvacuation = () => {
    setSystemStatus('evacuation');
    addAlert({
      title: 'Evacuation Triggered',
      message: 'Emergency evacuation has been initiated. All occupants must proceed to assembly points.',
      severity: 'critical',
    });
  };

  const handleReset = () => {
    setSystemStatus('normal');
    addAlert({
      title: 'System Reset',
      message: 'System has been reset to normal status.',
      severity: 'info',
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Control Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className={`p-4 rounded-lg mb-4 ${systemStatus === 'normal' ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-lg font-bold capitalize">{systemStatus}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleTriggerEvacuation}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              🚨 Trigger Evacuation
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Reset System
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-yellow-500 text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
              Activate Sprinklers
            </button>
            <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-bold hover:bg-purple-600 transition">
              Sound Alarm
            </button>
            <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-bold hover:bg-indigo-600 transition">
              Lock Doors
            </button>
            <button className="w-full bg-gray-500 text-white py-2 rounded-lg font-bold hover:bg-gray-600 transition">
              Call Emergency Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
