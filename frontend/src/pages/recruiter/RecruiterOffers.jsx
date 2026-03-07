import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { applicationAPI, offerAPI, jobAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Gift, Plus } from 'lucide-react';

export default function RecruiterOffers() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [apps, setApps]             = useState([]);
  const [offers, setOffers]         = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [activeApp, setActiveApp]   = useState(null);
  
  const [form, setForm]             = useState({ package: '', joiningDate: '', file: null });
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs || [])).catch(() => {});
    loadOffers();
  }, []);

  const loadOffers = () => {
    offerAPI.getRecruiterOffers()
      .then(r => setOffers(r.data.offers || []))
      .catch(() => {});
  };

  const loadApps = async (jobId) => {
    setSelectedJob(jobId);
    setApps([]);
    try {
      const r = await applicationAPI.getJobApps(jobId);
      // Only show selected students for offers
      setApps(r.data.applications?.filter(a => a.status === 'selected') || []);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error('Offer letter PDF is required');
    setSaving(true);
    const fd = new FormData();
    fd.append('package', Number(form.package));
    fd.append('joiningDate', form.joiningDate);
    fd.append('offerLetter', form.file);

    try {
      await offerAPI.create(activeApp._id, fd);
      toast.success('Offer created and sent!');
      setShowForm(false);
      setActiveApp(null);
      setForm({ package: '', joiningDate: '', file: null });
      loadOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const openOfferForm = (app) => {
    setActiveApp(app);
    setShowForm(true);
  };

  return (
    <DashboardLayout title="Offers">
      <div className="page-header">
        <h1>Offers</h1>
        <p>Send offer letters to selected candidates</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job to View Selected Candidates</label>
        <select className="form-select" value={selectedJob} onChange={e => loadApps(e.target.value)}>
          <option value="">-- Choose job --</option>
          {jobs.filter(j => j.approvedByCollege).map(j => (
            <option key={j._id} value={j._id}>{j.title}</option>
          ))}
        </select>
      </div>

      {selectedJob && apps.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted">Eligible Candidates (Selected Status)</h3>
          <div className="grid-2 gap-4">
            {apps.map(app => (
              <div className="card" key={app._id} style={{ padding: 16 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{app.student?.name}</div>
                    <div className="text-xs text-muted">{app.student?.email}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => openOfferForm(app)}>
                    <Plus size={14} /> Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedJob && apps.length === 0 && <p className="text-muted text-sm mb-8">No selected candidates for this job.</p>}

      {offers.length > 0 && (
        <>
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted">Sent Offers</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Job</th>
                  <th>Package</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o._id}>
                    <td className="font-semibold">{o.studentId?.name || '—'}</td>
                    <td className="text-muted text-sm">{o.jobId?.title}</td>
                    <td>₹{o.package} LPA</td>
                    <td className="text-muted">{new Date(o.joiningDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        o.status === 'accepted' ? 'badge-success' :
                        o.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && activeApp && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Send Offer Letter</h3>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowForm(false)}>×</button>
            </div>
            <p className="text-sm text-muted mb-4">To: {activeApp.student?.name} for {activeApp.job?.title}</p>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Package (LPA)</label>
                <input className="form-input" type="number" step="0.1" min="0" value={form.package} onChange={e => setForm(p => ({ ...p, package: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input className="form-input" type="date" value={form.joiningDate} onChange={e => setForm(p => ({ ...p, joiningDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Letter (PDF)</label>
                <input className="form-input" type="file" accept=".pdf" onChange={e => setForm(p => ({ ...p, file: e.target.files[0] }))} required />
              </div>
              <button className="btn btn-primary btn-block mt-6" type="submit" disabled={saving}>
                {saving ? <><span className="spinner" /> Sending…</> : 'Send Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
