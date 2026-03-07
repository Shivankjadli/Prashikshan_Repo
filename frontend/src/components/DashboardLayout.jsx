import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title }) {
  const { user } = useAuth();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-user">
            <div className="text-sm text-sec">{user?.email}</div>
            <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <main style={{ padding: '28px' }}>{children}</main>
      </div>
    </div>
  );
}
