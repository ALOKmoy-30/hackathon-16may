import { useState, useContext } from 'react';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[#090909] text-[#f0f0f0]">
      {loading && <LoadingSpinner />}
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto min-h-[calc(100vh-56px)] p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
