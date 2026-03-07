import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, applicationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Briefcase, DollarSign, User } from 'lucide-react';

export default function StudentJobs() {
  const [jobs, setJobs]       = useState([]);
  const [applied, setApplied] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    Promise.all([
      jobAPI.getApproved(),
      applicationAPI.getMyApps().catch(() => ({ data: { applications: [] } })),
    ]).then(([jRes, aRes]) => {
      setJobs(jRes.data.jobs || []);
      const ids = (aRes.data.applications || []).map(a => a.jobId || a.job?._id);
      setApplied(new Set(ids.map(String)));
    }).catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const apply = async (jobId) => {
    setApplying(jobId);
    try {
      await applicationAPI.apply(jobId);
      setApplied(p => new Set([...p, String(jobId)]));
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setApplying(null);
    }
  };

  return (
    <DashboardLayout title="Browse Jobs">
      <div className="page-header">
        <h1>Approved Jobs</h1>
        <p>{jobs.length} positions available</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><Briefcase /><h3>No approved jobs yet</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map(job => {
            const hasApplied = applied.has(String(job._id));
            return (
              <div className="card" key={job._id}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</h3>
                    <p className="text-sm font-medium mt-1">{job.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted flex items-center gap-1">
                        <User size={12} /> {job.recruiter?.name || 'Recruiter'}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                         ₹{job.salary?.toLocaleString()} LPA
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {job.requiresQuiz && <span className="badge badge-info">Quiz Required</span>}
                      {job.requiresAssignment && <span className="badge badge-info">Assignment Required</span>}
                    </div>
                  </div>
                  {hasApplied ? (
                    <span className="badge badge-success">Applied</span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => apply(job._id)}
                      disabled={applying === job._id}
                    >
                      {applying === job._id ? <span className="spinner" /> : 'Apply Now'}
                    </button>
                  )}
                </div>
                <p className="text-sm text-sec">{job.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
