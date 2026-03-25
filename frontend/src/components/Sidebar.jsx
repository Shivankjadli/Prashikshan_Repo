import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Briefcase, FileText, BookOpen,
  ClipboardList, Gift, BarChart3, CheckSquare, Users,
  GraduationCap, LogOut, X
} from 'lucide-react';

const studentLinks = [
  { to: '/student',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile',    icon: User,            label: 'My Profile' },
  { to: '/student/jobs',       icon: Briefcase,       label: 'Browse Jobs' },
  { to: '/student/applications',icon: FileText,       label: 'My Applications' },
  { to: '/student/quizzes',    icon: BookOpen,        label: 'Quizzes' },
  { to: '/student/assignments',icon: ClipboardList,   label: 'Assignments' },
  { to: '/student/offers',     icon: Gift,            label: 'Offers' },
];

const recruiterLinks = [
  { to: '/recruiter',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/jobs',        icon: Briefcase,       label: 'My Jobs' },
  { to: '/recruiter/applicants',  icon: Users,           label: 'Applicants' },
  { to: '/recruiter/quizzes',     icon: BookOpen,        label: 'Quizzes' },
  { to: '/recruiter/assignments', icon: ClipboardList,   label: 'Assignments' },
  { to: '/recruiter/offers',      icon: Gift,            label: 'Offers' },
  { to: '/recruiter/analytics',   icon: BarChart3,       label: 'Analytics' },
];

const collegeLinks = [
  { to: '/college',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/college/students',    icon: GraduationCap,   label: 'Students' },
  { to: '/college/jobs',        icon: Briefcase,       label: 'Job Approvals' },
  { to: '/college/quizzes',     icon: BookOpen,        label: 'Quiz Approvals' },
  { to: '/college/assignments', icon: ClipboardList,   label: 'Assignment Approvals' },
  { to: '/college/analytics',   icon: BarChart3,       label: 'Analytics' },
];

const roleLinks = { Student: studentLinks, Recruiter: recruiterLinks, College: collegeLinks };
const roleBadge = {
  Student: { label: 'Student', color: 'badge-accent' },
  Recruiter: { label: 'Recruiter', color: 'badge-warning' },
  College: { label: 'College', color: 'badge-success' },
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = roleLinks[user?.role] || [];
  const badge = roleBadge[user?.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-row">
          <h2>Prashikshan</h2>
          <button
            className="sidebar-close mobile-only"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <span>Academia Industry Interface</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <span className={`badge ${badge?.color}`}>{badge?.label}</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-block btn-sm" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
