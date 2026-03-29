import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, applicationAPI, offerAPI } from '../../services/api';
import { Briefcase, Users, Gift, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs]   = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      jobAPI.getMyJobs().catch(() => ({ data: { jobs: [] } })),
      offerAPI.getRecruiterOffers().catch(() => ({ data: { offers: [] } })),
    ]).then(([jRes, oRes]) => {
      const myJobs = jRes.data.jobs || [];
      setJobs(myJobs);
      setOffers(oRes.data.offers || []);

      const firstApproved = myJobs.find(j => j.approvedByCollege);
      if (firstApproved?._id) setSelectedJob(firstApproved._id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadApps = async () => {
      if (!selectedJob) { setApps([]); return; }
      setAppsLoading(true);
      try {
        const r = await applicationAPI.getJobApps(selectedJob);
        setApps(r.data.applications || []);
      } catch {
        setApps([]);
      } finally {
        setAppsLoading(false);
      }
    };
    loadApps();
  }, [selectedJob]);

  const approvedJobs = jobs.filter(j => j.approvedByCollege).length;
  const acceptedOffers = offers.filter(o => o.status === 'accepted').length;

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: '#4f46e5' },
    { label: 'Approved Jobs', value: approvedJobs, icon: Briefcase, color: '#7c3aed' },
    { label: 'Offers Sent', value: offers.length, icon: Gift, color: '#f59e0b' },
    { label: 'Accepted', value: acceptedOffers, icon: Users, color: '#10b981' },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Recruiter Dashboard">
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
    <DashboardLayout title="Recruiter Dashboard">
      <div className="page-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Manage your jobs, applicants and offers</p>
      </div>

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

      <div className="grid-2">
        <div className="card">
          <h3 className="font-semibold mb-4">Recent Jobs</h3>
          {jobs.slice(0, 5).map(j => (
            <div key={j._id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-semibold">{j.title}</span>
              <span className={`badge ${j.approvedByCollege ? 'badge-success' : 'badge-warning'}`}>
                {j.approvedByCollege ? 'Approved' : 'Pending'}
              </span>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-muted text-sm">No jobs yet</p>}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Recent Offers</h3>
          {offers.slice(0, 5).map(o => (
            <div key={o._id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-sm font-semibold">{o.studentId?.name}</div>
                <div className="text-xs text-muted">₹{o.package} LPA</div>
              </div>
              <span className={`badge ${o.status === 'accepted' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                {o.status}
              </span>
            </div>
          ))}
          {offers.length === 0 && <p className="text-muted text-sm">No offers sent yet</p>}
        </div>
      </div>

      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Assessment Progress</h3>
            <p className="text-xs text-muted mt-1">See whether applicants have attempted the quiz and submitted assignments</p>
          </div>
          <select
            className="form-select"
            style={{ width: 260 }}
            value={selectedJob}
            onChange={e => setSelectedJob(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select approved job --</option>
            {jobs.filter(j => j.approvedByCollege).map(j => (
              <option key={j._id} value={j._id}>{j.title}</option>
            ))}
          </select>
        </div>

        {appsLoading ? (
          <div className="loading-page"><div className="spinner" style={{ width: 28, height: 28 }} /></div>
        ) : !selectedJob ? (
          <div className="empty-state"><h3>Select an approved job to view applicants</h3></div>
        ) : apps.length === 0 ? (
          <div className="empty-state"><h3>No applicants yet for this job</h3></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz</th>
                  <th>Quiz Score</th>
                  <th>Assignments</th>
                  <th>Assignment Marks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.slice(0, 10).map(app => (
                  <tr key={app._id}>
                    <td>
                      <div className="font-semibold">{app.student?.name || '—'}</div>
                      <div className="text-muted text-xs">{app.student?.email || ''}</div>
                    </td>
                    <td>
                      {app.job?.requiresQuiz || app.assessmentStatus?.quiz?.attempted ? (
                        app.assessmentStatus?.quiz?.attempted ? (
                          <span className={`badge ${app.assessmentStatus.quiz.passed ? 'badge-success' : 'badge-warning'}`}>
                            {app.assessmentStatus.quiz.passed ? 'Attempted (Passed)' : 'Attempted'}
                          </span>
                        ) : (
                          <span className="badge badge-danger">Not Attempted</span>
                        )
                      ) : (
                        <span className="text-muted text-xs">Not required</span>
                      )}
                    </td>
                    <td className="text-muted">
                      {app.job?.requiresQuiz || app.assessmentStatus?.quiz?.attempted ? (
                        app.assessmentStatus?.quiz?.attempted ? (
                          <span className="font-semibold">
                            {app.assessmentStatus.quiz.score}{app.assessmentStatus.quiz.totalMarks ? `/${app.assessmentStatus.quiz.totalMarks}` : ''}
                          </span>
                        ) : '—'
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td>
                      {app.job?.requiresAssignment || (app.assessmentStatus?.assignments?.total > 0) ? (
                        <span className={`badge ${app.assessmentStatus?.assignments?.completed ? 'badge-success' : 'badge-warning'}`}>
                          {app.assessmentStatus?.assignments?.submitted || 0}/{app.assessmentStatus?.assignments?.total || 0}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">Not required</span>
                      )}
                    </td>
                    <td className="text-muted">
                      {app.job?.requiresAssignment || (app.assessmentStatus?.assignments?.total > 0) ? (
                        (app.assessmentStatus?.assignments?.submitted || 0) === 0 ? (
                          '—'
                        ) : (
                          <span className="font-semibold">
                            {app.assessmentStatus?.assignments?.marks?.reviewedCount > 0
                              ? `${app.assessmentStatus.assignments.marks.awarded}/${app.assessmentStatus.assignments.marks.max || 0}`
                              : 'Pending review'}
                          </span>
                        )
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        app.status === 'selected' ? 'badge-success' :
                        app.status === 'shortlisted' ? 'badge-warning' :
                        app.status === 'rejected' ? 'badge-danger' : 'badge-info'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
