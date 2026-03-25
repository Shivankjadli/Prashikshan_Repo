import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { applicationAPI } from '../../services/api';

const STATUS_COLOR = {
  applied: 'badge-info', shortlisted: 'badge-warning',
  selected: 'badge-success', rejected: 'badge-danger',
};

export default function StudentApplications() {
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI.getMyApps()
      .then(r => setApps(r.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Applications">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>{apps.length} total applications</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : apps.length === 0 ? (
        <div className="empty-state"><h3>No applications yet</h3></div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Recruiter</th>
                  <th>Salary</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app._id}>
                    <td className="font-semibold">{app.job?.title || '—'}</td>
                    <td className="font-medium text-sec">{app.job?.company || '—'}</td>
                    <td className="text-muted">{app.job?.recruiter?.name || '—'}</td>
                    <td>₹{app.job?.salary?.toLocaleString()} LPA</td>
                    <td className="text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${STATUS_COLOR[app.status] || 'badge-muted'}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {apps.map(app => (
              <div className="mobile-card" key={app._id}>
                <div className="mobile-card-header">
                  <div>
                    <div className="mobile-card-title">{app.job?.title || '—'}</div>
                    <div className="mobile-card-subtitle">{app.job?.company || '—'}</div>
                  </div>
                  <span className={`badge ${STATUS_COLOR[app.status] || 'badge-muted'}`}>{app.status}</span>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Recruiter</span>
                    <span className="mobile-card-value">{app.job?.recruiter?.name || '—'}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Salary</span>
                    <span className="mobile-card-value">₹{app.job?.salary?.toLocaleString()} LPA</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Applied</span>
                    <span className="mobile-card-value">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
