import { useState, useContext, useEffect } from 'react';
import { useAlerts } from '../hooks/useAlerts.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Alerts() {
  const { alerts } = useAlerts();
  const { acknowledgeAlert } = useContext(AppContext);
  const [alertFilter, setAlertFilter] = useState('all');
  const [localAlerts, setLocalAlerts] = useState(null);

  const mockDataAlerts = [
    {
      id: "1",
      zone: "Room 1",
      title: "Elevated Smoke",
      type: "SMOKE",
      severity: "warning",
      message: "Smoke levels elevated — demo alert",
      resolved: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: "2",
      zone: "Main Hall",
      title: "High Temperature",
      type: "TEMPERATURE",
      severity: "critical",
      message: "High temperature detected — demo",
      resolved: true,
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      resolvedAt: new Date(Date.now() - 10 * 60000).toISOString()
    }
  ];

  const displayAlerts = localAlerts ?? (alerts?.length > 0 ? alerts : mockDataAlerts) ?? [];

  const handleAcknowledge = async (alertId) => {
    // Optimistic update
    setLocalAlerts(prev => (prev ?? displayAlerts).map(a =>
      a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
    ));
    
    // Call AppContext if available
    if (acknowledgeAlert) {
      acknowledgeAlert(alertId);
    }
  };

  const filteredAlerts = displayAlerts.filter(a => {
    if (alertFilter === 'active') return !a.resolved;
    if (alertFilter === 'resolved') return a.resolved;
    return true;
  });

  const totalAlerts = displayAlerts.length;
  const criticalCount = displayAlerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const warningCount = displayAlerts.filter(a => a.severity === 'warning' && !a.resolved).length;
  const isOffline = import.meta.env.VITE_USE_REAL_DATA === 'false' || true;

  // Calculate BarChart Data
  const zoneCounts = {};
  displayAlerts.forEach(a => {
    zoneCounts[a.zone] = (zoneCounts[a.zone] || 0) + 1;
  });
  const barData = Object.keys(zoneCounts).map(zone => ({
    zone,
    alerts: zoneCounts[zone]
  }));

  // Ensure all zones exist in barData
  const allZones = ['Room 1', 'Room 2', 'Main Hall'];
  allZones.forEach(z => {
    if (!zoneCounts[z]) barData.push({ zone: z, alerts: 0 });
  });

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
          <p className="text-xs text-[#888888] uppercase tracking-wide mt-1">Active Critical</p>
        </div>
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
          <p className="text-2xl font-bold text-[#f0f0f0]">{warningCount}</p>
          <p className="text-xs text-[#888888] uppercase tracking-wide mt-1">Active Warning</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#141414] border border-[#222222] rounded-xl p-5">
        <h2 className="text-[#f0f0f0] text-base font-semibold mb-4">Alerts by Zone</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#222222" vertical={false} />
              <XAxis dataKey="zone" tick={{ fill: "#555555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555555", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#1e1e1e' }} contentStyle={{ background: "#141414", border: "1px solid #222222", borderRadius: "8px", color: "#f0f0f0" }} />
              <Bar dataKey="alerts" fill="#00ff88" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-[#0f0f0f] rounded-lg p-1 inline-flex">
        {['all', 'active', 'resolved'].map(tab => (
          <button
            key={tab}
            onClick={() => setAlertFilter(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 capitalize ${
              alertFilter === tab
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
          <p className="text-[#888888] text-sm">All clear — no alerts found</p>
          {isOffline && (
            <p className="text-[#333333] text-xs mt-2 font-mono">No alerts generated — demo mode active</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-[#141414] border border-[#222222] rounded-xl p-4 transition-all duration-200 hover:bg-[#181818] ${
                alert.resolved ? 'opacity-60 border-l-4 border-l-[#333333]' :
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
                      alert.resolved ? 'text-[#555555]' :
                      alert.severity === 'critical' ? 'text-[#ff4444]'
                        : alert.severity === 'warning' ? 'text-[#ffaa00]'
                        : 'text-[#00ff88]'
                    }`}
                  />
                  <div className="min-w-0">
                    <h3 className={`text-sm font-semibold ${alert.resolved ? 'text-[#888888]' : 'text-[#f0f0f0]'}`}>{alert.title}</h3>
                    <p className="text-xs text-[#555555] mt-0.5">{alert.message}</p>
                    <div className="text-[10px] text-[#333333] mt-2 flex gap-3">
                      <span>Generated: {new Date(alert.createdAt || Date.now()).toLocaleTimeString()}</span>
                      {alert.resolved && alert.resolvedAt && (
                        <span>Resolved: {new Date(alert.resolvedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {alert.resolved ? (
                    <span className="text-[#00ff88] text-xs font-medium px-3 py-1">Resolved ✓</span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 rounded-lg px-3 py-1 text-xs transition-colors duration-200"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
