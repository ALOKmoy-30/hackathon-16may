import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Navigation, Settings, Bell, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sensors', label: 'Sensor Map', icon: MapPin },
  { path: '/evacuation', label: 'Evacuation Paths', icon: Navigation },
  { path: '/control', label: 'Control Panel', icon: Settings },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 lg:hidden z-40" onClick={onClose}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-neutral-900 border-r border-neutral-800 text-white z-50 transform transition-transform duration-500 ease-in-out lg:static lg:transform-none ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="lg:hidden flex justify-end p-6">
          <button onClick={onClose} className="p-3 touch-target bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition">
            <X size={26} />
          </button>
        </div>

        <nav className="p-6 space-y-4 mt-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Main Command</p>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 touch-target ${
                location.pathname === path
                  ? 'bg-emerald-500 text-black font-black shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon size={22} />
              <span className="text-sm tracking-tight">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
