export function StatusBadge({ status = 'OFFLINE' }) {
  const styles = {
    NORMAL: 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20',
    WARNING: 'bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20',
    DANGER: 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20',
    OFFLINE: 'bg-[#555555]/10 text-[#555555] border border-[#555555]/20',
    // lowercase variants for compatibility
    normal: 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20',
    warning: 'bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20',
    critical: 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20',
    danger: 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20',
    offline: 'bg-[#555555]/10 text-[#555555] border border-[#555555]/20',
  };

  const badgeClass = styles[status] || styles.OFFLINE;
  const isDanger = status === 'DANGER' || status === 'danger' || status === 'critical';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${badgeClass}`}>
      {isDanger && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] mr-1.5 inline-block animate-pulse" />
      )}
      {status}
    </span>
  );
}
