import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, assignmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CollegeAssignments() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [acting, setActing]         = useState(null);

  useEffect(() => {
    jobAPI.getAllForApproval()
      .then(r => setJobs(r.data.jobs?.filter(j => j.approvedByCollege) || []))
      .catch(() => toast.error('Failed to load approved jobs'));
  }, []);

  const loadAssignments = async (jobId) => {
    setSelectedJob(jobId);
    setAssignments([]);
    if (!jobId) return;
    setLoading(true);
    try {
      const r = await assignmentAPI.getForJobCollege(jobId);
      setAssignments(r.data.assignments || []);
    } catch {
      toast.error('Failed to view assignments');
    } finally {
      setLoading(false);
    }
  };

  const approveAssignment = async (asgnId, approved) => {
    setActing(asgnId);
    try {
      await assignmentAPI.approve(asgnId, approved);
      toast.success(approved ? 'Assignment approved' : 'Assignment rejected');
      setAssignments(p => p.map(a => a._id === asgnId ? { ...a, approvedByCollege: approved } : a));
    } catch {
      toast.error('Action failed');
    } finally {
      setActing(null);
    }
  };

  return (
    <DashboardLayout title="Assignment Approvals">
      <div className="page-header">
        <h1>Assignment Approvals</h1>
        <p>Review recruiter assignments before students can view them</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job to View Pending Assignments</label>
        <select className="form-select" value={selectedJob} onChange={e => loadAssignments(e.target.value)}>
          <option value="">-- Choose approved job --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {loading && <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>}

      {!loading && selectedJob && assignments.length === 0 && (
        <div className="empty-state"><h3>No assignments submitted for this job</h3></div>
      )}

      {assignments.map(asgn => (
        <div className="card mb-4" key={asgn._id}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold">{asgn.subject}</h3>
              <p className="text-sm text-muted mt-1">Deadline: {new Date(asgn.deadline).toLocaleString()} · {asgn.maxMarks} Marks</p>
            </div>
            {asgn.approvedByCollege ? (
              <button className="btn btn-sm btn-danger" onClick={() => approveAssignment(asgn._id, false)} disabled={acting === asgn._id}>
                {acting === asgn._id ? <span className="spinner" /> : 'Revoke'}
              </button>
            ) : (
              <button className="btn btn-sm btn-success" onClick={() => approveAssignment(asgn._id, true)} disabled={acting === asgn._id}>
                {acting === asgn._id ? <span className="spinner" /> : 'Approve Assignment'}
              </button>
            )}
          </div>
          <div className="mt-4 p-4" style={{ background: 'var(--bg-glass)', borderRadius: 8 }}>
            <span className="text-xs text-muted uppercase">Description / Question</span>
            <p className="text-sm mt-1 whitespace-pre-wrap">{asgn.description}</p>
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
