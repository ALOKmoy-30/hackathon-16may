import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Menu, Bell } from 'lucide-react';
import { DataSourceBadge } from './DataSourceBadge.jsx';

export function Navbar({ onMenuToggle }) {
  const { isConnected } = useContext(AppContext);

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
      <div className="px-4 py-4 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-black text-xl text-white touch-target">
          <span className="text-3xl">🔥</span>
          <span className="hidden sm:inline tracking-tighter">FireEvac Premium</span>
        </Link>

        <div className="flex items-center gap-6">
          <DataSourceBadge />
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isConnected ? 'bg-emerald-500 glow-emerald' : 'bg-red-500 glow-crimson'}`}></div>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-neutral-400">
              {isConnected ? 'System Live' : 'Offline'}
            </span>
          </div>

          <button className="relative p-2.5 text-neutral-400 hover:text-white transition-colors touch-target">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-neutral-900"></span>
          </button>

          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition touch-target"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
