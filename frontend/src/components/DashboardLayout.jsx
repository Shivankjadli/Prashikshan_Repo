import { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children, title }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="topbar-hamburger mobile-only"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              id="sidebar-toggle"
            >
              <Menu size={20} />
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-user">
            <div className="text-sm text-sec desktop-only">{user?.email}</div>
            <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
