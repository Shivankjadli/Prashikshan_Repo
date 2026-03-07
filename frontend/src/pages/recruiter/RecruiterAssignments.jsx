import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, assignmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Download } from 'lucide-react';

export default function RecruiterAssignments() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState({ subject: '', description: '', deadline: '', maxMarks: '' });
  const [saving, setSaving]         = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [subsMap, setSubsMap]       = useState({}); // { asgnId: [submissions] }
  const [viewingSub, setViewingSub] = useState(null);
  const [marks, setMarks]           = useState('');

  useEffect(() => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs || [])).catch(() => {});
  }, []);

  const loadAssignments = async (jobId) => {
    setSelectedJob(jobId);
    setAssignments([]);
    if (!jobId) return;
    try {
      const r = await assignmentAPI.getForJobRecruiter(jobId);
      setAssignments(r.data.assignments || []);
    } catch {}
  };

  const loadSubmissions = async (asgnId) => {
    try {
      const r = await assignmentAPI.getSubmissions(asgnId);
      setSubsMap(p => ({ ...p, [asgnId]: r.data.submissions || [] }));
    } catch (err) {
      toast.error('Could not load submissions');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await assignmentAPI.create(selectedJob, form);
      toast.success('Assignment created! Awaiting college approval.');
      setShowForm(false);
      setForm({ subject: '', description: '', deadline: '', maxMarks: '' });
      loadAssignments(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const openReview = (sub) => {
    setViewingSub(sub);
    setMarks(sub.marksAwarded ?? '');
  };

  const handleReview = async () => {
    try {
      await assignmentAPI.review(viewingSub._id, Number(marks));
      toast.success('Marks updated');
      setViewingSub(null);
      loadSubmissions(viewingSub.assignmentId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update marks');
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Assignments</h1>
          <p>Create assignments and review student answers</p>
        </div>
        {selectedJob && (
          <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
            {showForm ? 'Cancel' : <><Plus size={16} /> Create Assignment</>}
          </button>
        )}
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job</label>
        <select className="form-select" value={selectedJob} onChange={e => loadAssignments(e.target.value)}>
          <option value="">-- Select approved job --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">New Assignment</h3>
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description / Question</label>
              <textarea className="form-textarea" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            </div>
            <div className="form-group" style={{ maxWidth: 240 }}>
              <label className="form-label">Max Marks</label>
              <input className="form-input" type="number" min={1} value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: Number(e.target.value) }))} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Creating…</> : 'Create Assignment'}
            </button>
          </form>
        </div>
      )}

      {selectedJob && !showForm && (
        assignments.length === 0 ? <div className="empty-state"><h3>No assignments created yet</h3></div> :
        assignments.map(asgn => (
          <div className="card mb-4" key={asgn._id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{asgn.subject}</h3>
                <span className={`badge ${asgn.approvedByCollege ? 'badge-success' : 'badge-warning'} mt-1`}>
                  {asgn.approvedByCollege ? 'Approved' : 'Pending'}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => loadSubmissions(asgn._id)}>
                View Submissions
              </button>
            </div>

            {subsMap[asgn._id] && (
              <div className="mt-4" style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 8 }}>
                <h4 className="font-semibold mb-3">Submissions ({subsMap[asgn._id].length})</h4>
                {subsMap[asgn._id].length === 0 && <p className="text-sm text-muted">No submissions yet.</p>}
                {subsMap[asgn._id].map(sub => (
                  <div key={sub._id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="text-sm font-semibold">{sub.studentId?.name}</div>
                      <div className="text-xs text-muted">Submitted: {new Date(sub.submittedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sub.reviewed ? (
                        <span className="badge badge-success">Marks: {sub.marksAwarded}/{asgn.maxMarks}</span>
                      ) : (
                        <span className="badge badge-warning">Pending Review</span>
                      )}
                      <button className="btn btn-secondary btn-sm" onClick={() => { viewingSub ? setViewingSub(null) : openReview(sub) }}>
                        {viewingSub?._id === sub._id ? 'Close' : 'Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Review Modal */}
      {viewingSub && (
        <div className="modal-overlay" onClick={() => setViewingSub(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Review Submission</h3>
              <button className="btn btn-icon btn-secondary" onClick={() => setViewingSub(null)}>×</button>
            </div>
            <p className="text-sm text-muted mb-4">Student: {viewingSub.studentId?.name}</p>
            <div className="form-group">
              <label className="form-label">Answer Text</label>
              <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8, fontSize: '0.9rem', whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto' }}>
                {viewingSub.answerText}
              </div>
            </div>
            {viewingSub.fileUrl && (
              <a href={viewingSub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mb-4">
                <Download size={14} /> Download Attachment
              </a>
            )}
            <div className="form-group mt-4">
              <label className="form-label">Assign Marks</label>
              <input className="form-input" type="number" min={0} value={marks} onChange={e => setMarks(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleReview} disabled={!marks}>Submit Marks</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
