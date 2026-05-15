import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

export function SensorCard({ sensor }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER': return 'text-red-500 danger-pulse';
      case 'WARNING': return 'text-orange-500';
      case 'NORMAL': return 'text-emerald-500';
      default: return 'text-neutral-400';
    }
  };

  const getBadgeBg = (status) => {
    switch (status) {
      case 'DANGER': return 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'WARNING': return 'bg-orange-500 text-white';
      case 'NORMAL': return 'bg-emerald-500 text-black';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="bg-neutral-900 rounded-3xl p-6 transition-all duration-300 hover:bg-neutral-800 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-black text-xl text-white tracking-tight group-hover:text-emerald-500 transition-colors">{sensor.name}</h3>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{sensor.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getBadgeBg(sensor.status)}`}>
          {sensor.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Thermal', value: `${sensor.temperature}°C` },
          { label: 'Humidity', value: `${sensor.humidity}%` },
          { label: 'Smoke', value: sensor.smokeLevel },
          { label: 'Toxic Gas', value: sensor.gasLevel },
        ].map((item, i) => (
          <div key={i} className="bg-black/20 rounded-2xl p-4">
            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-xl font-black tracking-tight ${getStatusColor(sensor.status)}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {sensor.history && (
        <div className="h-12 opacity-40 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensor.history}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={sensor.status === 'DANGER' ? '#EF4444' : '#10B981'}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
