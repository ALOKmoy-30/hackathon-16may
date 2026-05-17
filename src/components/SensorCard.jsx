import { Thermometer, Flame, Wind, Info } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge.jsx';

export function SensorCard({ sensor }) {
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
    <div className="bg-[#141414] border border-[#222222] rounded-xl p-5 transition-all duration-200 hover:bg-[#181818] hover:border-[#2a2a2a] group">
      {/* Top row: icon + info */}
      <div className="flex items-center justify-between mb-3">
        <Icon size={20} className="text-[#00ff88]" />
        <button className="text-[#555555] hover:text-[#888888] transition-colors duration-200">
          <Info size={16} />
        </button>
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
    </div>
  );
}
