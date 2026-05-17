import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Menu, Bell } from 'lucide-react';
import { DataSourceBadge } from './DataSourceBadge.jsx';

const zones = ['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];

export function Navbar({ onMenuToggle }) {
  const { alerts } = useContext(AppContext);

  return (
    <nav className="sticky top-0 z-50 h-14 bg-[#0a0a0a] border-b border-[#1e1e1e] px-6 flex items-center justify-between">
      {/* Left: Mobile menu + Zone tabs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-[#888888] hover:text-white transition-colors duration-200"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {zones.map((zone, idx) => (
            <button
              key={zone}
              className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 border-b-2 ${
                idx === 0
                  ? 'text-[#00ff88] border-[#00ff88]'
                  : 'text-[#888888] border-transparent hover:text-[#f0f0f0]'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Right: DataSourceBadge + Bell + Avatar */}
      <div className="flex items-center gap-3">
        <DataSourceBadge />

        {/* Bell icon */}
        <button className="relative p-2 text-[#888888] hover:text-white transition-colors duration-200">
          <Bell size={20} />
          {alerts && alerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff4444] rounded-full" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center text-black text-xs font-semibold">
          A
        </div>
      </div>
    </nav>
  );
}
