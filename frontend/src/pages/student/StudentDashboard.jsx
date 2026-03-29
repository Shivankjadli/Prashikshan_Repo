import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, applicationAPI, offerAPI } from '../../services/api';
import { Briefcase, FileText, Gift, CheckCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [apps, setApps]         = useState([]);
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      studentAPI.getCompletion().catch(() => null),
      applicationAPI.getMyApps().catch(() => ({ data: { applications: [] } })),
      offerAPI.getMyOffers().catch(() => ({ data: { offers: [] } })),
    ]).then(([pRes, aRes, oRes]) => {
      setProfile(pRes?.data);
      setApps(aRes.data.applications || []);
      setOffers(oRes.data.offers || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Profile Complete', value: `${profile?.completionPercentage || 0}%`, icon: User, color: '#4f46e5' },
    { label: 'Applications', value: apps.length, icon: FileText, color: '#7c3aed' },
    { label: 'Selected', value: apps.filter(a => a.status === 'selected').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Offers', value: offers.length, icon: Gift, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard">
        <div className="page-header">
          <div className="skeleton skeleton-text lg" style={{ width: '50%' }} />
          <div className="skeleton skeleton-text sm" style={{ width: '35%', marginTop: 8 }} />
        </div>
        <div className="grid-4 mb-8">
          {[1,2,3,4].map(i => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-value" />
              <div className="skeleton skeleton-label" />
            </div>
          ))}
        </div>
        <div className="grid-2">
          <div className="skeleton-card"><div className="skeleton skeleton-text" /><div className="skeleton skeleton-text sm" /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" /><div className="skeleton skeleton-text sm" /></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="page-header">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Here's an overview of your placement journey</p>
      </div>

      {profile && !profile.profile?.approvedForPlacement && (
        <div className="alert alert-info mb-6">
          ℹ Your placement approval is pending. Complete your profile and wait for college approval.
        </div>
      )}

      <div className="grid-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className="icon" style={{ background: `${color}12`, borderRadius: 12 }}>
              <Icon size={22} color={color} />
            </div>
            <div className="value">{value}</div>
            <div className="label">{label}</div>
          </div>
        ))}
      </div>

      {/* Profile completion progress */}
      <div className="grid-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ fontSize: '1rem' }}>Profile Completion</h3>
          <div className="progress-bar mb-3">
            <div className="progress-fill" style={{ width: `${profile?.completionPercentage || 0}%` }} />
          </div>
          <p className="text-sm text-muted">{profile?.completionPercentage || 0}% complete</p>
          {profile?.completedFields && (
            <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(profile.completedFields).map(([key, done]) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <span style={{ color: done ? 'var(--success)' : 'var(--text-muted)' }}>
                    {done ? '✓' : '○'}
                  </span>
                  <span style={{ color: done ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'capitalize' }}>{key}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/student/profile" className="btn btn-primary btn-sm mt-4">Update Profile</Link>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4" style={{ fontSize: '1rem' }}>Recent Applications</h3>
          {apps.length === 0 ? (
            <p className="text-muted text-sm">No applications yet. <Link to="/student/jobs" style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse jobs →</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {apps.slice(0, 4).map(app => (
                <div key={app._id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-sm font-semibold">{app.job?.title || 'Job'}</div>
                    <div className="text-xs text-muted">{new Date(app.appliedAt).toLocaleDateString()}</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }) {
  const map = {
    applied: 'badge-info', shortlisted: 'badge-warning',
    selected: 'badge-success', rejected: 'badge-danger',
    pending: 'badge-muted', accepted: 'badge-success',
  };
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
}
