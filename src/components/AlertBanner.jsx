import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function AlertBanner({ alert, onClose }) {
  useEffect(() => {
    // Info alerts auto-close, warnings/critical stay until manually dismissed for safety
    if (alert.severity === 'info') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.severity, onClose]);

  const getAlertStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-l-[#ff4444] bg-[#141414] border border-[#222222]';
      case 'warning':
        return 'border-l-4 border-l-[#ffaa00] bg-[#141414] border border-[#222222]';
      case 'info':
        return 'border-l-4 border-l-[#00ff88] bg-[#141414] border border-[#222222]';
      default:
        return 'bg-[#141414] border border-[#222222]';
    }
  };

  const getIconColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-[#ff4444]';
      case 'warning': return 'text-[#ffaa00]';
      case 'info': return 'text-[#00ff88]';
      default: return 'text-[#888888]';
    }
  };

  return (
    <div className={`${getAlertStyles(alert.severity)} rounded-xl p-4 flex items-center gap-4 transition-all duration-200`}>
      <AlertTriangle size={18} className={getIconColor(alert.severity)} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#f0f0f0] mb-0.5">{alert.title}</h4>
        <p className="text-xs text-[#888888] truncate sm:whitespace-normal">{alert.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-[#555555] hover:text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors duration-200"
        aria-label="Dismiss Alert"
      >
        <X size={16} />
      </button>
    </div>
  );
}
