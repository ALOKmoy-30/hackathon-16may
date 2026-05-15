import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { Menu, X, Bell } from 'lucide-react';

export function Navbar({ onMenuToggle }) {
  const { isConnected } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle?.(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🔥</span>
          <span className="hidden sm:inline text-gray-900">FireEvac System</span>
          <span className="sm:hidden text-gray-900">FireEvac</span>
        </Link>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="hidden sm:inline text-xs font-medium text-gray-600">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          {/* Notification bell */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin avatar */}
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold hidden sm:flex">
            A
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/sensors"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sensor Map
            </Link>
            <Link
              to="/evacuation"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Evacuation Paths
            </Link>
            <Link
              to="/control"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Control Panel
            </Link>
            <Link
              to="/alerts"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alerts
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
