import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, applicationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['applied', 'shortlisted', 'rejected', 'selected'];

const statusBadgeClass = (status) => {
  if (status === 'selected') return 'badge-success';
  if (status === 'shortlisted') return 'badge-warning';
  if (status === 'rejected') return 'badge-danger';
  return 'badge-info';
};

export default function RecruiterApplicants() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [apps, setApps]             = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs || [])).catch(() => {});
  }, []);

  const loadApps = async (jobId) => {
    setSelectedJob(jobId);
    setApps([]);
    try {
      const r = await applicationAPI.getJobApps(jobId);
      setApps(r.data.applications || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load applicants');
    }
  };

  const updateStatus = async (appId, status) => {
    setUpdatingId(appId);
    try {
      await applicationAPI.updateStatus(appId, status);
      toast.success(`Status updated to ${status}`);
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusSelect = (app) => (
    <select
      className="form-select"
      style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: 36 }}
      value={app.status}
      disabled={updatingId === app._id}
      onChange={e => updateStatus(app._id, e.target.value)}
    >
      {STATUSES.map(s => {
        const needsGate = (s === 'shortlisted' || s === 'selected');
        const blocked = needsGate && app.assessmentStatus && !app.assessmentStatus.eligibleToShortlistOrSelect;
        return (
          <option key={s} value={s} disabled={blocked}>
            {blocked ? `${s} (requires quiz/assignment)` : s}
          </option>
        );
      })}
    </select>
  );

  const renderQuizInfo = (app) => {
    if (app.job?.requiresQuiz || app.assessmentStatus?.quiz?.attempted) {
      if (app.assessmentStatus?.quiz?.attempted) {
        return (
          <span className={`badge ${app.assessmentStatus.quiz.passed ? 'badge-success' : 'badge-warning'}`}>
            {app.assessmentStatus.quiz.passed ? 'Passed' : 'Attempted'}
            {' '}{app.assessmentStatus.quiz.score}{app.assessmentStatus.quiz.totalMarks ? `/${app.assessmentStatus.quiz.totalMarks}` : ''}
          </span>
        );
      }
      return <span className="badge badge-danger">Not Attempted</span>;
    }
    return <span className="text-muted text-xs">N/A</span>;
  };

  const renderAssignmentInfo = (app) => {
    if (app.job?.requiresAssignment || (app.assessmentStatus?.assignments?.total > 0)) {
      return (
        <span className={`badge ${app.assessmentStatus?.assignments?.completed ? 'badge-success' : 'badge-warning'}`}>
          {app.assessmentStatus?.assignments?.submitted || 0}/{app.assessmentStatus?.assignments?.total || 0}
        </span>
      );
    }
    return <span className="text-muted text-xs">N/A</span>;
  };

  return (
    <DashboardLayout title="Applicants">
      <div className="page-header">
        <h1>Applicants</h1>
        <p>Review and shortlist candidates</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job</label>
        <select className="form-select" value={selectedJob} onChange={e => loadApps(e.target.value)}>
          <option value="">-- Select a job --</option>
          {jobs.filter(j => j.approvedByCollege).map(j => (
            <option key={j._id} value={j._id}>{j.title}</option>
          ))}
        </select>
      </div>

      {apps.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Applied On</th>
                  <th>Quiz</th>
                  <th>Quiz Score</th>
                  <th>Assignments</th>
                  <th>Assignment Marks</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app._id}>
                    <td className="font-semibold">{app.student?.name || '—'}</td>
                    <td className="text-muted">{app.student?.email}</td>
                    <td className="text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
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
                          <>
                            <span className="font-semibold">
                              {app.assessmentStatus?.assignments?.marks?.reviewedCount > 0
                                ? `${app.assessmentStatus.assignments.marks.awarded}/${app.assessmentStatus.assignments.marks.max || 0}`
                                : 'Pending review'}
                            </span>
                            {app.assessmentStatus?.assignments?.marks?.pendingReviewCount > 0 && (
                              <div className="text-xs text-muted mt-1">
                                {app.assessmentStatus.assignments.marks.pendingReviewCount} pending review
                              </div>
                            )}
                          </>
                        )
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{renderStatusSelect(app)}</td>
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
                    <div className="mobile-card-title">{app.student?.name || '—'}</div>
                    <div className="mobile-card-subtitle">{app.student?.email}</div>
                  </div>
                  <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Applied</span>
                    <span className="mobile-card-value">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Quiz</span>
                    <span className="mobile-card-value">{renderQuizInfo(app)}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Assignments</span>
                    <span className="mobile-card-value">{renderAssignmentInfo(app)}</span>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  {renderStatusSelect(app)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedJob && apps.length === 0 && (
        <div className="empty-state"><h3>No applicants for this job</h3></div>
      )}
    </DashboardLayout>
  );
}
