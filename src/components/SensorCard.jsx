import { useState } from 'react';
import { Thermometer, Flame, Wind, Info } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge.jsx';

export function SensorCard({ sensor }) {
  const [showInfo, setShowInfo] = useState(false);
  const isOffline = import.meta.env.VITE_USE_REAL_DATA === 'false' || true; // Fallback to true if undefined

  const getIcon = () => {
    const type = (sensor.type || sensor.name || '').toLowerCase();
    if (type.includes('temp') || type.includes('thermal')) return Thermometer;
    if (type.includes('flame') || type.includes('fire')) return Flame;
    return Wind;
  };

  const Icon = getIcon();

  const getValue = () => {
    if (sensor.value !== undefined) return sensor.value;
    if (sensor.temperature !== undefined) return `${sensor.temperature}°C`;
    return '--';
  };

  const getUnit = () => {
    const type = (sensor.type || sensor.name || '').toLowerCase();
    if (type.includes('temp') || type.includes('thermal')) return '°C';
    if (type.includes('smoke')) return '%';
    if (type.includes('flame')) return '';
    return '';
  };

  return (
    <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 transition-all duration-200 hover:bg-[#181818] hover:border-[#2a2a2a] group relative">
      {/* Top row: icon + info */}
      <div className="flex items-center justify-between mb-3">
        <Icon size={20} className="text-[#00ff88]" />
        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="text-[#333333] text-[10px] font-mono uppercase tracking-widest mt-1">
              DEMO
            </span>
          )}
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`${showInfo ? 'text-[#00ff88]' : 'text-[#555555]'} hover:text-[#888888] transition-colors duration-200`}
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Sensor name */}
      <h3 className="text-sm font-semibold text-[#f0f0f0] mb-1">{sensor.name}</h3>

      {/* Location */}
      <p className="text-xs text-[#555555] mb-3">{sensor.location || sensor.zone || ''}</p>

      {/* Value + Badge */}
      <div className="flex items-end justify-between">
        <p className="text-sm text-[#888888]">
          {getValue()}{getUnit()}
        </p>
        <StatusBadge status={sensor.status || 'NORMAL'} />
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="mt-3 pt-3 border-t border-[#222222] text-xs text-[#888888] space-y-1">
          <p><span className="text-[#555555]">Type:</span> {sensor.type || sensor.sensorType || 'N/A'}</p>
          <p><span className="text-[#555555]">Zone:</span> {sensor.zone || 'N/A'}</p>
          <p><span className="text-[#555555]">Updated:</span> {sensor.lastUpdated ? new Date(sensor.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}</p>
          {sensor.rawValue && <p><span className="text-[#555555]">ADC:</span> {sensor.rawValue}</p>}
        </div>
      )}
    </div>
  );
}
