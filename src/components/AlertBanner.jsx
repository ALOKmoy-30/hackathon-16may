import { useEffect } from 'react';
import { X } from 'lucide-react';

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
        return 'bg-crimson-red border-white border-2 danger-pulse';
      case 'warning':
        return 'bg-orange-600 border-orange-400 border';
      case 'info':
        return 'bg-emerald-green border-emerald-300 border';
      default:
        return 'bg-gray-800 border-gray-600 border';
    }
  };

  return (
    <div className={`${getAlertStyles(alert.severity)} text-white p-4 rounded-xl shadow-2xl flex justify-between items-center gap-4 animate-in slide-in-from-top duration-300`}>
      <div className="flex-1 min-w-0">
        <h4 className="font-black uppercase tracking-tight text-sm mb-0.5">{alert.title}</h4>
        <p className="text-xs font-medium opacity-90 truncate sm:whitespace-normal">{alert.message}</p>
      </div>
      <button
        onClick={onClose}
        className="touch-target flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full transition w-11 h-11"
        aria-label="Dismiss Alert"
      >
        <X size={20} />
      </button>
    </div>
  );
}
