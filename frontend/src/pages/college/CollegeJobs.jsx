import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CollegeJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null);

  const load = () => {
    jobAPI.getAllForApproval()
      .then(r => setJobs(r.data.jobs || []))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setActing(id);
    try {
      await jobAPI.approve(id);
      toast.success('Job approved for placements');
      load();
    } catch { toast.error('Approval failed'); }
    finally { setActing(null); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this job posting?')) return;
    setActing(id);
    try {
      await jobAPI.reject(id);
      toast.success('Job rejected/deleted');
      load();
    } catch { toast.error('Rejection failed'); }
    finally { setActing(null); }
  };

  return (
    <DashboardLayout title="Job Approvals">
      <div className="page-header">
        <h1>Job Approvals</h1>
        <p>Review jobs posted by recruiters</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><h3>No pending jobs to review</h3></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map(job => (
            <div className="card" key={job._id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <div className="text-sm text-muted mt-1">{job.recruiter?.name} · {job.recruiter?.email}</div>
                </div>
                {job.approvedByCollege ? (
                  <span className="badge badge-success">Approved</span>
                ) : (
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-success" disabled={acting === job._id} onClick={() => handleApprove(job._id)}>
                      {acting === job._id ? <span className="spinner" /> : 'Approve'}
                    </button>
                    <button className="btn btn-sm btn-danger" disabled={acting === job._id} onClick={() => handleReject(job._id)}>
                      {acting === job._id ? <span className="spinner" /> : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4" style={{ background: 'var(--bg-glass)', borderRadius: 8 }}>
                <div className="grid-2 gap-4 mb-3">
                  <div><span className="text-xs text-muted uppercase">Salary</span><div className="font-semibold">₹{job.salary} LPA</div></div>
                  <div><span className="text-xs text-muted uppercase">Posted On</span><div className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</div></div>
                </div>
                <div><span className="text-xs text-muted uppercase">Description</span><p className="text-sm mt-1">{job.description}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
