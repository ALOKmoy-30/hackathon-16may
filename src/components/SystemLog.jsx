import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';

export function SystemLog() {
  const { systemLog } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hiddenRoutes = ['/evacuation', '/sensors'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  if (systemLog.length === 0 && !isOpen) return null;

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-[#ff4444]';
      case 'warning': return 'text-[#ffaa00]';
      default: return 'text-[#00ff88]';
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-[#1e1e1e] transition-all duration-300 z-[60] ${isOpen ? 'h-72' : 'h-10'}`}>
      <div
        className="flex items-center justify-between px-4 h-10 cursor-pointer hover:bg-[#0a0a0a] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#00ff88]" />
          <span className="text-xs font-medium text-[#f0f0f0]">
            System Logs <span className="text-[#555555] ml-1">[{systemLog.length}]</span>
          </span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-[#555555]" /> : <ChevronUp size={16} className="text-[#555555]" />}
      </div>

      {isOpen && (
        <div className="p-4 font-mono text-xs max-h-[calc(100%-2.5rem)] overflow-y-auto space-y-2">
          {systemLog.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2">
              <span className="text-[#555555] shrink-0">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              <span className={getLogColor(entry.type)}>
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
