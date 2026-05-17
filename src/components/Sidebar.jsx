import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Navigation, Settings, Bell, Power } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sensors', label: 'Sensors', icon: List },
  { path: '/evacuation', label: 'Evacuation', icon: Navigation },
  { path: '/control', label: 'Control Panel', icon: Settings },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-[60px] bg-[#111111] border-r border-[#222222] z-40 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Nav icons */}
        <nav className="flex-1 flex flex-col items-center pt-4 gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[rgba(0,255,136,0.05)] text-[#00ff88]'
                    : 'text-[#555555] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {/* Active accent bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00ff88] rounded-r-full" />
                )}
                <Icon size={20} />
                {/* Tooltip */}
                <span className="absolute left-16 bg-[#1a1a1a] text-[#f0f0f0] text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="flex flex-col items-center pb-4 mt-auto">
          <button
            className="group relative flex items-center justify-center w-10 h-10 rounded-lg text-[#555555] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
          >
            <Power size={20} />
            <span className="absolute left-16 bg-[#1a1a1a] text-[#f0f0f0] text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
