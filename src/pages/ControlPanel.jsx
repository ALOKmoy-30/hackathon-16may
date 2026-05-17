import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { getTelegramStatus } from '../services/telegramService.js';
import { ChevronDown, ChevronUp, Play, Square } from 'lucide-react';
import { startStressTestSimulation, stopStressTestSimulation } from '../mock/mockData.js';

// Toggle switch component
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer relative ${
        checked ? 'bg-[#00ff88]' : 'bg-[#333333]'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full shadow transition-transform duration-200 absolute top-0.5 ${
          checked ? 'bg-black translate-x-5' : 'bg-[#888888] translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function ControlPanel() {
  const { addAlert, setSensors, addLogEntry } = useContext(AppContext);
  const [systemStatus, setSystemStatus] = useState('normal');
  const [showTelegramInstructions, setShowTelegramInstructions] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sprinklersOn, setSprinklersOn] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);
  const [doorsLocked, setDoorsLocked] = useState(false);

  const telegramStatus = getTelegramStatus();

  const handleStartStressTest = () => {
    setIsSimulating(true);
    addLogEntry({ type: 'warning', message: 'Stress test simulation started: Fire spreading from Lab to Hallway.' });
    startStressTestSimulation((newData) => {
      setSensors(newData.sensors);
      addLogEntry({ type: 'info', message: 'Simulation update received (Fire spreading).' });
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Control Panel</h1>
        <p className="text-sm text-[#555555] mt-1">System controls and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* System Status */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">System Status</h2>
          <div className={`p-4 rounded-xl mb-4 ${
            systemStatus === 'normal'
              ? 'bg-[#0a1f0f] border border-[#00ff88]/20'
              : 'bg-[#1f0000] border border-[#ff4444]/20'
          }`}>
            <p className={`text-sm font-semibold capitalize ${
              systemStatus === 'normal' ? 'text-[#00ff88]' : 'text-[#ff4444]'
            }`}>
              {systemStatus}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleTriggerEvacuation}
              className="w-full border border-[#ff4444]/30 text-[#ff4444] py-2.5 rounded-lg text-sm font-medium hover:bg-[#ff4444]/10 transition-colors duration-200 active:scale-95"
            >
              🚨 Trigger Evacuation
            </button>
            <button
              onClick={handleReset}
              className="w-full border border-[#00ff88]/30 text-[#00ff88] py-2.5 rounded-lg text-sm font-medium hover:bg-[#00ff88]/10 transition-colors duration-200 active:scale-95"
            >
              Reset System
            </button>
          </div>
        </div>

        {/* Quick Actions with Toggles */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#f0f0f0]">Activate Sprinklers</span>
              <ToggleSwitch checked={sprinklersOn} onChange={setSprinklersOn} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#f0f0f0]">Sound Alarm</span>
              <ToggleSwitch checked={alarmOn} onChange={setAlarmOn} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#f0f0f0]">Lock Doors</span>
              <ToggleSwitch checked={doorsLocked} onChange={setDoorsLocked} />
            </div>
          </div>
        </div>

        {/* Stress Test Simulator */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Stress Test Simulator</h2>
          <p className="text-sm text-[#888888] mb-4">
            Simulates a fire spreading from the Lab to the Hallway over 30 seconds.
          </p>
          <div className="space-y-3">
            {!isSimulating ? (
              <button
                onClick={handleStartStressTest}
                className="w-full flex items-center justify-center gap-2 border border-[#ffaa00]/30 text-[#ffaa00] py-2.5 rounded-lg text-sm font-medium hover:bg-[#ffaa00]/10 transition-colors duration-200 active:scale-95"
              >
                <Play size={16} />
                Start Fire Spread Simulation
              </button>
            ) : (
              <button
                onClick={handleStopStressTest}
                className="w-full flex items-center justify-center gap-2 border border-[#555555]/30 text-[#888888] py-2.5 rounded-lg text-sm font-medium hover:bg-[#555555]/10 transition-colors duration-200 active:scale-95"
              >
                <Square size={16} />
                Stop Simulation
              </button>
            )}
          </div>
        </div>

        {/* Telegram Settings */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Telegram Notifications</h2>

          {/* Connection Banner */}
          <div className={`p-4 rounded-xl mb-4 ${
            telegramStatus.connected
              ? 'bg-[#0a1f0f] border border-[#00ff88]/20'
              : 'bg-[#1f0000] border border-[#ff4444]/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Connection Status</span>
              <span className={`text-sm font-medium ${
                telegramStatus.connected ? 'text-[#00ff88]' : 'text-[#ff4444]'
              }`}>
                {telegramStatus.message}
              </span>
            </div>
          </div>

          {/* Instructions toggle */}
          <div className="border border-[#222222] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTelegramInstructions(!showTelegramInstructions)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#181818] transition-colors duration-200"
            >
              <span className="text-sm text-[#f0f0f0]">How to connect</span>
              {showTelegramInstructions ? <ChevronUp size={16} className="text-[#555555]" /> : <ChevronDown size={16} className="text-[#555555]" />}
            </button>

            {showTelegramInstructions && (
              <div className="p-4 border-t border-[#222222] bg-[#0f0f0f]">
                <ol className="space-y-3 text-sm text-[#888888]">
                  <li className="flex gap-3">
                    <span className="text-[#00ff88] font-medium min-w-[50px]">Step 1:</span>
                    <span>Create a bot via @BotFather on Telegram</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00ff88] font-medium min-w-[50px]">Step 2:</span>
                    <span>Copy the API token</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00ff88] font-medium min-w-[50px]">Step 3:</span>
                    <span>Set <code className="bg-[#0f0f0f] border border-[#333333] px-2 py-0.5 rounded text-[#f0f0f0] text-xs">VITE_TELEGRAM_BOT_TOKEN=your_token</code> in .env</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00ff88] font-medium min-w-[50px]">Step 4:</span>
                    <span>Set <code className="bg-[#0f0f0f] border border-[#333333] px-2 py-0.5 rounded text-[#f0f0f0] text-xs">VITE_USE_REAL_DATA=true</code> in .env</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00ff88] font-medium min-w-[50px]">Step 5:</span>
                    <span>Restart the dev server with <code className="bg-[#0f0f0f] border border-[#333333] px-2 py-0.5 rounded text-[#f0f0f0] text-xs">npm run dev</code></span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
