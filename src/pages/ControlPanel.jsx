import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { getTelegramStatus } from '../services/telegramService.js';
import { ChevronDown, ChevronUp, Play, Square } from 'lucide-react';
import { startStressTestSimulation, stopStressTestSimulation } from '../mock/mockData.js';

export function ControlPanel() {
  const { addAlert, setSensors, addLogEntry } = useContext(AppContext);
  const [systemStatus, setSystemStatus] = useState('normal');
  const [showTelegramInstructions, setShowTelegramInstructions] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const telegramStatus = getTelegramStatus();

  const handleStartStressTest = () => {
    setIsSimulating(true);
    addLogEntry({ type: 'warning', message: 'Stress test simulation started: Fire spreading from Lab to Hallway.' });
    startStressTestSimulation((newData) => {
      setSensors(newData.sensors);
      addLogEntry({ type: 'info', message: 'Simulation update received.', data: newData });
    });
  };

  const handleStopStressTest = () => {
    setIsSimulating(false);
    const finalData = stopStressTestSimulation();
    setSensors(finalData.sensors);
    addLogEntry({ type: 'info', message: 'Stress test simulation stopped and reset.' });
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Stress Test Simulator</h2>
          <p className="text-sm text-gray-600 mb-4">
            Simulates a fire spreading from the Lab to the Hallway over 30 seconds. Use this to test real-time monitoring and path rerouting.
          </p>
          <div className="space-y-3">
            {!isSimulating ? (
              <button
                onClick={handleStartStressTest}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
              >
                <Play size={20} />
                Start Fire Spread Simulation
              </button>
            ) : (
              <button
                onClick={handleStopStressTest}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition"
              >
                <Square size={20} />
                Stop Simulation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Telegram Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Telegram Notification Settings</h2>

        {/* Connection Status */}
        <div className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Connection Status:</span>
            <span className={`font-bold ${telegramStatus.connected ? 'text-green-600' : 'text-gray-600'}`}>
              {telegramStatus.message}
            </span>
          </div>
        </div>

        {/* How to Connect Instructions */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setShowTelegramInstructions(!showTelegramInstructions)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <span className="font-semibold text-gray-700">How to connect</span>
            {showTelegramInstructions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showTelegramInstructions && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-[60px]">Step 1:</span>
                  <span>Create a bot via @BotFather on Telegram</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-[60px]">Step 2:</span>
                  <span>Copy the API token</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-[60px]">Step 3:</span>
                  <span>Set <code className="bg-gray-200 px-2 py-1 rounded">VITE_TELEGRAM_BOT_TOKEN=your_token</code> in .env</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-[60px]">Step 4:</span>
                  <span>Set <code className="bg-gray-200 px-2 py-1 rounded">VITE_USE_REAL_DATA=true</code> in .env</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 min-w-[60px]">Step 5:</span>
                  <span>Restart the dev server with <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
