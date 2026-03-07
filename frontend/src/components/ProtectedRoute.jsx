import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects unauthenticated users to /login
export function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
}

// Redirects authenticated users away from auth pages
export function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (!user) return children;
  const redirects = { Student: '/student', Recruiter: '/recruiter', College: '/college' };
  return <Navigate to={redirects[user.role] || '/'} replace />;
}
