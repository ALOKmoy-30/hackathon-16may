import { useState, useEffect } from 'react';
import { useSensors } from '../hooks/useSensors.jsx';
import { FloorPlan } from '../components/FloorPlan.jsx';
import { ChartWidget } from '../components/ChartWidget.jsx';
import { X, Activity } from 'lucide-react';
import { mockSensorData } from '../mock/mockData.js';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';

export function SensorMap() {
  const { sensors, loading } = useSensors();
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slideOver, setSlideOver] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const isOffline = import.meta.env.VITE_USE_REAL_DATA === 'false' || true;

  const displayData = sensors?.length > 0 ? sensors : mockSensorData.sensors;
  const zones = [...new Set(displayData.map(s => s.zone))];

  const filtered = displayData.filter(s => {
    const zoneOk = zoneFilter === 'all' || s.zone === zoneFilter;
    const statusOk = statusFilter === 'all' || (s.status?.toLowerCase() || 'normal') === statusFilter.toLowerCase();
    return zoneOk && statusOk;
  });

  const loadHistory = async (zone) => {
    // Generate 50 realistic mock readings
    const mock = Array.from({length:50}, (_,i) => ({
      timestamp: new Date(Date.now() - (50-i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(100 + Math.sin(i/5) * 20 + (Math.random() * 10 - 5))
    }));
    setHistoryData(mock);
  };

  useEffect(() => {
    if (!slideOver) return;
    loadHistory(slideOver.zone);
  }, [slideOver?.zone]);

  return (
    <div className="space-y-5 relative">
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Sensor Map</h1>
        <p className="text-sm text-[#555555] mt-1">Interactive floor plan and sensor details</p>
      </div>

      {loading ? (
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00ff88] border-t-transparent" />
        </div>
      ) : (
        <FloorPlan sensors={displayData} />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[#141414] p-4 rounded-xl border border-[#222222]">
        <div className="flex items-center gap-4">
          <select
            value={zoneFilter}
            onChange={e => setZoneFilter(e.target.value)}
            className="bg-[#0f0f0f] border border-[#333333] text-[#f0f0f0] rounded-lg px-3 py-2 text-sm focus:border-[#00ff88] outline-none transition-colors duration-200"
          >
            <option value="all">All Zones</option>
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <div className="flex gap-4">
            {['all', 'normal', 'warning', 'danger'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`text-sm font-medium pb-1 capitalize transition-colors duration-200 ${
                  statusFilter === tab
                    ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
                    : 'text-[#888888] hover:text-[#f0f0f0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#222222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#888888]">
            <thead className="bg-[#0a0a0a] border-b border-[#222222] text-[#f0f0f0]">
              <tr>
                <th className="px-4 py-3 font-medium">Sensor Name</th>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">
                  Status {isOffline && <span className="text-[#333333] text-xs ml-1">(DEMO)</span>}
                </th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filtered.map(sensor => (
                <tr key={sensor.id} className="hover:bg-[#181818] transition-colors duration-150">
                  <td className="px-4 py-3 text-[#f0f0f0]">{sensor.name}</td>
                  <td className="px-4 py-3">{sensor.zone}</td>
                  <td className="px-4 py-3">
                    {sensor.value ?? sensor.temperature ?? "—"}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {isOffline && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full bg-[#555555]" 
                        title="Simulated reading"
                      />
                    )}
                    <StatusBadge status={sensor.status || 'NORMAL'} />
                  </td>
                  <td className="px-4 py-3">
                    {sensor.lastUpdated ? new Date(sensor.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSlideOver(sensor)}
                      className="text-[#00ff88] hover:text-[#00cc6a] text-xs font-medium transition-colors duration-200"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#555555]">
                    No sensors match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View History Slide-over */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          slideOver ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSlideOver(null)}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[#141414] border-l border-[#222222] z-50 transform transition-transform duration-300 flex flex-col ${
          slideOver ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-[#00ff88]" size={20} />
            <h3 className="text-lg font-semibold text-[#f0f0f0]">History: {slideOver?.name}</h3>
          </div>
          <button 
            onClick={() => setSlideOver(null)}
            className="text-[#555555] hover:text-[#f0f0f0] transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div>
            <p className="text-sm text-[#888888] mb-4">Past 50 simulated readings for {slideOver?.zone}.</p>
            <div className="h-48">
              <ChartWidget data={historyData} dataKey="value" title="" color="#00ff88" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
