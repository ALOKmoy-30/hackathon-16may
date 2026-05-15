import { useState, useContext } from 'react';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-black text-white">
      {loading && <LoadingSpinner />}
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full overflow-x-hidden p-4 lg:p-6 pb-24 safe-area-inset-bottom">
          {children}
        </main>
      </div>
    </div>
  );
}
