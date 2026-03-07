import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { applicationAPI, assignmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';

export default function StudentAssignments() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [active, setActive]           = useState(null);
  const [form, setForm]               = useState({ answerText: '', file: null });
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    applicationAPI.getMyApps()
      .then(r => setJobs(r.data.applications || []))
      .catch(() => {});
  }, []);

  const loadAssignments = async (jobId) => {
    setSelectedJob(jobId);
    setAssignments([]);
    setActive(null);
    try {
      const r = await assignmentAPI.getForJob(jobId);
      setAssignments(r.data.assignments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append('answerText', form.answerText);
    if (form.file) fd.append('file', form.file);
    try {
      await assignmentAPI.submit(active._id, fd);
      toast.success('Assignment submitted!');
      setActive(null);
      loadAssignments(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="page-header">
        <h1>Assignments</h1>
        <p>Submit assignments for your applied jobs</p>
      </div>

      {!active && (
        <div className="card mb-6">
          <label className="form-label">Select Job</label>
          <select className="form-select" onChange={e => loadAssignments(e.target.value)} defaultValue="">
            <option value="" disabled>-- Pick a job --</option>
            {jobs.map(a => (
              <option key={a._id} value={a.jobId || a.job?._id}>
                {a.job?.title || 'Job'}
              </option>
            ))}
          </select>
        </div>
      )}

      {!active && selectedJob && (
        assignments.length === 0
          ? <div className="empty-state"><ClipboardList /><h3>No assignments for this job</h3></div>
          : assignments.map(asgn => (
            <div className="card mb-4" key={asgn._id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{asgn.subject}</h3>
                  <p className="text-sm text-muted">{asgn.description}</p>
                  <p className="text-xs text-muted mt-1">
                    Deadline: {new Date(asgn.deadline).toLocaleDateString()} · Max Marks: {asgn.maxMarks}
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { setActive(asgn); setForm({ answerText: '', file: null }); }}>
                  Submit
                </button>
              </div>
            </div>
          ))
      )}

      {active && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">{active.subject}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setActive(null)}>← Back</button>
          </div>
          <p className="text-sm text-sec mb-4">{active.description}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Answer</label>
              <textarea className="form-textarea" rows={8}
                value={form.answerText}
                onChange={e => setForm(p => ({ ...p, answerText: e.target.value }))}
                placeholder="Write your answer here…" required />
            </div>
            <div className="form-group">
              <label className="form-label">Attach File (optional – PDF/DOC/TXT)</label>
              <input type="file" className="form-input" accept=".pdf,.doc,.docx,.txt"
                onChange={e => setForm(p => ({ ...p, file: e.target.files[0] }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" /> Submitting…</> : 'Submit Assignment'}
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
