import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export function Alerts() {
  const { alerts, removeAlert } = useAlerts();
  const [filter, setFilter] = useState('all');

  const filteredAlerts = (alerts || []).filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'warning') return alert.severity === 'warning';
    if (filter === 'info') return alert.severity === 'info';
    return true;
  });

  const totalAlerts = (alerts || []).length;
  const criticalCount = (alerts || []).filter(a => a.severity === 'critical').length;
  const warningCount = (alerts || []).filter(a => a.severity === 'warning').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Alerts</h1>
        <p className="text-sm text-[#555555] mt-1">Active alerts and notifications</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <p className="text-2xl font-bold text-[#f0f0f0]">{totalAlerts}</p>
          <p className="text-xs text-[#888888] uppercase tracking-wide mt-1">Total Alerts</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <p className="text-2xl font-bold text-[#f0f0f0]">{criticalCount}</p>
          <p className="text-xs text-[#888888] uppercase tracking-wide mt-1">Critical</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <p className="text-2xl font-bold text-[#f0f0f0]">{warningCount}</p>
          <p className="text-xs text-[#888888] uppercase tracking-wide mt-1">Warning</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-[#0f0f0f] rounded-lg p-1 inline-flex">
        {['all', 'critical', 'warning', 'info'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 capitalize ${
              filter === tab
                ? 'bg-[#141414] text-[#00ff88]'
                : 'text-[#888888] hover:text-[#f0f0f0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-[#141414] border border-[#222222] rounded-xl py-12 flex flex-col items-center justify-center">
          <CheckCircle size={40} className="text-[#00ff88] mb-3" />
          <p className="text-[#888888] text-sm">All clear — no active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-[#141414] border border-[#222222] rounded-xl p-4 transition-all duration-200 hover:bg-[#181818] ${
                alert.severity === 'critical'
                  ? 'border-l-4 border-l-[#ff4444]'
                  : alert.severity === 'warning'
                  ? 'border-l-4 border-l-[#ffaa00]'
                  : 'border-l-4 border-l-[#00ff88]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <AlertTriangle
                    size={18}
                    className={`mt-0.5 shrink-0 ${
                      alert.severity === 'critical' ? 'text-[#ff4444]'
                        : alert.severity === 'warning' ? 'text-[#ffaa00]'
                        : 'text-[#00ff88]'
                    }`}
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#f0f0f0]">{alert.title}</h3>
                    <p className="text-xs text-[#888888] mt-0.5">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 rounded-lg px-3 py-1 text-xs transition-colors duration-200"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-1.5 text-[#555555] hover:text-[#f0f0f0] transition-colors duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
