import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

export default function RecruiterJobs() {
  const [jobs, setJobs]     = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ title: '', company: '', description: '', salary: '', requiresQuiz: false, requiresAssignment: false, targetColleges: [] });
  const [saving, setSaving] = useState(false);
  const [colleges, setColleges] = useState([]);

  const load = () => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs || [])).catch(() => {});
    import('../../services/api').then(m => m.authAPI.getColleges()).then(res => setColleges(res.data.colleges || []));
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ title: '', company: '', description: '', salary: '', requiresQuiz: false, requiresAssignment: false, targetColleges: [] });
    setEditId(null);
    setShowForm(false);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await jobAPI.update(editId, { ...form, salary: Number(form.salary) });
        toast.success('Job updated successfully!');
      } else {
        await jobAPI.create({ ...form, salary: Number(form.salary) });
        toast.success('Job posted! Awaiting college approval.');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      company: job.company || '',
      description: job.description,
      salary: job.salary,
      requiresQuiz: job.requiresQuiz,
      requiresAssignment: job.requiresAssignment,
      targetColleges: job.targetColleges || []
    });
    setEditId(job._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this job posting? This cannot be undone.')) return;
    try {
      await jobAPI.delete(id);
      toast.success('Job deleted successfully');
      load();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <DashboardLayout title="My Jobs">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>My Jobs</h1>
          <p>Create and manage your job postings</p>
        </div>
        <button className="btn btn-primary" onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Post Job</>}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ border: editId ? '1px solid var(--accent)' : '' }}>
          <h3 className="font-semibold mb-4">{editId ? 'Edit Job Posting' : 'New Job Posting'}</h3>
          <form onSubmit={handleCreateOrUpdate}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Software Engineer Intern" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} required placeholder="e.g. Google" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={5} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Describe the role, requirements…" />
            </div>
            <div className="form-group">
              <label className="form-label">Salary (LPA)</label>
              <input className="form-input" type="number" min="0" step="0.1" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} required placeholder="e.g. 8" />
            </div>
            <div className="form-group">
              <label className="form-label">Select Target Colleges (Hold Ctrl/Cmd to select multiple)</label>
              <select className="form-select" multiple style={{ height: 120 }} value={form.targetColleges} 
                onChange={e => setForm(p => ({ ...p, targetColleges: Array.from(e.target.selectedOptions, o => o.value) }))} required>
                {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <p className="text-xs text-muted mt-1">Which colleges should see and approve this job?</p>
            </div>
            <div className="grid-2 gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.requiresQuiz}
                  onChange={e => setForm(p => ({ ...p, requiresQuiz: e.target.checked }))}
                />
                Requires Quiz completion
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.requiresAssignment}
                  onChange={e => setForm(p => ({ ...p, requiresAssignment: e.target.checked }))}
                />
                Requires Assignment submission
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Saving…</> : editId ? 'Save Changes' : 'Post Job'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {jobs.map(job => (
          <div className="card" key={job._id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm font-medium mt-1">{job.company}</p>
                <p className="text-sm text-muted mt-1">₹{job.salary} LPA · {new Date(job.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-2">
                  {job.requiresQuiz && <span className="badge badge-info">Quiz Required</span>}
                  {job.requiresAssignment && <span className="badge badge-info">Assignment Required</span>}
                </div>
              </div>
               <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                 <span className={`badge ${job.approvedByCollege ? 'badge-success' : 'badge-warning'}`}>
                   {job.approvedByCollege ? 'Approved' : 'Pending Approval'}
                 </span>
                 <div className="flex gap-2">
                   <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(job)}>Edit</button>
                   <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                 </div>
               </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div className="empty-state"><h3>No jobs posted yet</h3></div>}
      </div>
    </DashboardLayout>
  );
}
