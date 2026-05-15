import { useEffect } from 'react';

export function AlertBanner({ alert, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`${getAlertColor(alert.severity)} text-white p-4 rounded-lg shadow-lg flex justify-between items-center`}>
      <div>
        <h4 className="font-bold">{alert.title}</h4>
        <p className="text-sm">{alert.message}</p>
      </div>
      <button onClick={onClose} className="text-xl font-bold">×</button>
    </div>
  );
}
