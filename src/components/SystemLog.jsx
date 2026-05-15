import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export function SystemLog() {
  const { systemLog } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  if (systemLog.length === 0 && !isOpen) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 transition-all duration-500 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${isOpen ? 'h-80' : 'h-12'}`}>
      <div className="flex items-center justify-between px-8 h-12 cursor-pointer hover:bg-neutral-800 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-emerald-500 glow-emerald" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System Logs <span className="text-neutral-500 ml-2">[{systemLog.length}]</span></span>
        </div>
        <div className="flex items-center gap-6">
          {isOpen ? <ChevronDown size={20} className="text-neutral-500" /> : <ChevronUp size={20} className="text-neutral-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-8 h-68 overflow-y-auto font-mono text-[10px] space-y-4 bg-black">
          {systemLog.map((entry) => (
            <div key={entry.id} className="border-b border-neutral-900 pb-4 last:border-0">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-neutral-600 font-bold">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className={`px-2 py-0.5 rounded font-black uppercase tracking-tighter ${
                  entry.type === 'error' ? 'bg-red-500 text-white' :
                  entry.type === 'warning' ? 'bg-orange-500 text-white' :
                  'bg-emerald-500 text-black'
                }`}>{entry.type}</span>
                <span className="text-neutral-300 font-bold">{entry.message}</span>
              </div>
              {entry.data && (
                <pre className="bg-neutral-900 p-4 rounded-2xl text-neutral-400 overflow-x-auto border border-neutral-800">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
