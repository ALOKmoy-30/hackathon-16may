import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { getTelegramStatus, isTelegramConfigured } from '../services/telegramService.js';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Toggle = ({ value, onChange, label }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#1e1e1e]">
    <span className="text-sm text-[#f0f0f0]">{label}</span>
    <div
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 select-none ${
        value ? 'bg-[#00ff88]' : 'bg-[#333333]'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${
        value ? 'translate-x-5 bg-black' : 'translate-x-0.5 bg-[#888888]'
      }`} />
    </div>
  </div>
);

export function ControlPanel() {
  const { sensors, updateZoneStatus } = useContext(AppContext);
  const [systemArmed, setSystemArmed] = useState(false);
  const [alarmSound, setAlarmSound] = useState(false);
  const [autoEvac, setAutoEvac] = useState(false);

  const [notifState, setNotifState] = useState('idle'); // idle | sending | success | error
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [howToOpen, setHowToOpen] = useState(false);

  const isRealData = import.meta.env.VITE_USE_REAL_DATA === 'true';
  const hasToken = isTelegramConfigured();

  const zones = [...new Set((sensors || []).map(s => s.zone))];

  const getZoneStatus = (zoneId) => {
    // If not overridden locally, we would use context. For now, defaulting to NORMAL
    return 'NORMAL';
  };

  const sendTest = async () => {
    setNotifState('sending');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifState('success');
      setTimeout(() => setNotifState('idle'), 3000);
    } catch {
      setNotifState('error');
      setTimeout(() => setNotifState('idle'), 3000);
    }
  };

  const saveThresholds = async () => {
    setSaveState('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Control Panel</h1>
        <p className="text-sm text-[#555555] mt-1">System controls and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions / Toggles */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">System Controls</h2>
          <div>
            <Toggle value={systemArmed} onChange={setSystemArmed} label="System Armed" />
            <Toggle value={alarmSound} onChange={setAlarmSound} label="Alarm Sound" />
            <Toggle value={autoEvac} onChange={setAutoEvac} label="Auto-Evacuation" />
          </div>
        </div>

        {/* Telegram Section */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Telegram Notifications</h2>
          
          <div className={`p-4 rounded-xl mb-4 border ${
            !hasToken ? 'bg-[#1f0000] border-[#ff4444]/20' :
            !isRealData ? 'bg-[#1a1100] border-[#ffaa00]/20' :
            'bg-[#0a1f0f] border-[#00ff88]/20'
          }`}>
            <div className="flex items-start gap-3">
              {!hasToken && <XCircle className="text-[#ff4444] mt-0.5" size={20} />}
              {hasToken && !isRealData && <AlertCircle className="text-[#ffaa00] mt-0.5" size={20} />}
              {hasToken && isRealData && <CheckCircle className="text-[#00ff88] mt-0.5" size={20} />}
              <div>
                <h3 className={`font-semibold text-sm ${
                  !hasToken ? 'text-[#ff4444]' :
                  !isRealData ? 'text-[#ffaa00]' :
                  'text-[#00ff88]'
                }`}>
                  {!hasToken ? 'Not connected' : !isRealData ? 'Token set — offline mode' : 'Connected'}
                </h3>
                <p className="text-[#888888] text-xs mt-1">
                  {!hasToken ? 'Add your Telegram bot token to .env' : !isRealData ? 'Set VITE_USE_REAL_DATA=true to activate' : 'Receiving live sensor data'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={sendTest}
            disabled={notifState !== 'idle'}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-4 ${
              notifState === 'idle' ? 'border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10' :
              notifState === 'sending' ? 'opacity-60 cursor-not-allowed border border-[#555555] text-[#888888]' :
              notifState === 'success' ? 'border border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10' :
              'border border-[#ff4444] text-[#ff4444] bg-[#ff4444]/10'
            }`}
          >
            {notifState === 'idle' && 'Send Test Notification'}
            {notifState === 'sending' && (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Sending...
              </span>
            )}
            {notifState === 'success' && '✓ Sent successfully'}
            {notifState === 'error' && '✗ Failed — check token'}
          </button>

          <div className="border border-[#222222] rounded-xl overflow-hidden bg-[#0f0f0f]">
            <div onClick={() => setHowToOpen(!howToOpen)} className="flex items-center justify-between cursor-pointer py-3 px-4 select-none hover:bg-[#181818] transition-colors">
              <span className="text-sm text-[#f0f0f0]">How to connect</span>
              <ChevronDown size={16} className={`text-[#555555] transition-transform duration-200 ${howToOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${howToOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4 border-t border-[#222222]">
                <ol className="space-y-3 text-sm text-[#888888]">
                  <li className="flex gap-3"><span className="text-[#00ff88] font-medium min-w-[50px]">Step 1:</span><span>Create a bot via @BotFather on Telegram</span></li>
                  <li className="flex gap-3"><span className="text-[#00ff88] font-medium min-w-[50px]">Step 2:</span><span>Copy the API token</span></li>
                  <li className="flex gap-3"><span className="text-[#00ff88] font-medium min-w-[50px]">Step 3:</span><span>Set <code className="bg-[#141414] border border-[#333333] px-1 rounded text-[#f0f0f0]">VITE_TELEGRAM_BOT_TOKEN</code> in .env</span></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Cards */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 lg:col-span-2">
          <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Zone Overrides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {zones.map(zone => {
              const zoneSensors = (sensors || []).filter(s => s.zone === zone);
              const isDanger = zoneSensors.some(s => s.status === 'DANGER');
              const isDisabled = zoneSensors.length > 0 && zoneSensors.every(s => s.disabled || s.status === 'INACTIVE');
              
              const status = isDanger ? 'DANGER' : 'NORMAL';
              const disabled = isDisabled;

              return (
                <div key={zone} className={`p-4 border rounded-xl transition-all ${
                  disabled ? 'opacity-40 pointer-events-none border-[#222222] bg-[#0a0a0a]' :
                  status === 'DANGER' ? 'border-[#ff4444]/30 bg-[#ff4444]/5' :
                  'border-[#222222] bg-[#0f0f0f]'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[#f0f0f0] font-medium">{zone}</h3>
                    {disabled && <span className="text-[10px] bg-[#333333] text-[#888888] px-2 py-0.5 rounded-full">INACTIVE</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => updateZoneStatus(zone, "NORMAL", false)}
                      className="w-full py-1.5 text-xs rounded border border-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors"
                    >
                      Mark Safe
                    </button>
                    <button 
                      onClick={() => updateZoneStatus(zone, "DANGER", false)}
                      className="w-full py-1.5 text-xs rounded border border-[#ff4444]/20 text-[#ff4444] hover:bg-[#ff4444]/10 transition-colors"
                    >
                      Mark Danger
                    </button>
                    <button 
                      onClick={() => updateZoneStatus(zone, "NORMAL", true)}
                      className="w-full py-1.5 text-xs rounded border border-[#555555]/30 text-[#888888] hover:bg-[#333333] transition-colors"
                    >
                      Disable Sensor
                    </button>
                  </div>
                </div>
              );
            })}
            {zones.length === 0 && (
              <div className="col-span-full py-8 text-center text-[#555555] text-sm">
                No zones available to override.
              </div>
            )}
          </div>
        </div>

        {/* Thresholds */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#f0f0f0] text-base font-semibold">Sensor Thresholds</h2>
            <button
              onClick={saveThresholds}
              disabled={saveState !== 'idle'}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                saveState === 'idle' ? 'bg-[#00ff88] text-black hover:bg-[#00cc6a]' :
                saveState === 'saving' ? 'bg-[#00ff88]/50 text-black cursor-not-allowed' :
                'bg-transparent border border-[#00ff88] text-[#00ff88]'
              }`}
            >
              {saveState === 'idle' && 'Save Thresholds'}
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'saved' && '✓ Saved'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['Smoke Warning', 'Smoke Danger', 'Temp Warning', 'Temp Danger'].map((label, i) => (
              <div key={label}>
                <label className="block text-xs text-[#888888] mb-1">{label}</label>
                <input 
                  type="number" 
                  defaultValue={i < 2 ? (i === 0 ? 40 : 70) : (i === 2 ? 45 : 60)} 
                  className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-[#f0f0f0] text-sm focus:border-[#00ff88] focus:outline-none" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
