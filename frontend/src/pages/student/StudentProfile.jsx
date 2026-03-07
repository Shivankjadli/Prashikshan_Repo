import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({ branch: '', cgpa: '', skills: '', projects: '', certifications: '' });
  const [file, setFile]       = useState(null);
  const [completion, setCompletion] = useState(0);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colleges, setColleges]   = useState([]);
  const [collegeId, setCollegeId] = useState('');

  const load = async () => {
    try {
      const [pRes, cRes, colRes] = await Promise.all([
        studentAPI.getProfile().catch(() => null),
        studentAPI.getCompletion().catch(() => null),
        authAPI.getColleges().catch(() => ({ data: { colleges: [] } })),
      ]);
      
      if (colRes?.data?.colleges) setColleges(colRes.data.colleges);

      if (pRes?.data?.profile) {
        const p = pRes.data.profile;
        setProfile(p);
        setCollegeId(p.collegeId || '');
        setForm({
          branch:         p.branch || '',
          cgpa:           p.cgpa ?? '',
          skills:         (p.skills || []).join(', '),
          projects:       (p.projects || []).join('\n'),
          certifications: (p.certifications || []).join(', '),
        });
      }
      if (cRes?.data) setCompletion(cRes.data.completionPercentage || 0);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        collegeId,
        branch:         form.branch,
        cgpa:           parseFloat(form.cgpa),
        skills:         form.skills.split(',').map(s => s.trim()).filter(Boolean),
        projects:       form.projects.split('\n').map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
      };
      await studentAPI.saveProfile(payload);
      toast.success('Profile saved!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      await studentAPI.uploadResume(fd);
      toast.success('Resume uploaded!');
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await studentAPI.deleteResume();
      toast.success('Resume removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Keep your profile complete to get placement approval</p>
      </div>

      {/* Completion Bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">Profile Completion</span>
          <span className="font-bold text-accent">{completion}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
        {profile?.approvedForPlacement && (
          <div className="alert alert-success mt-4">✓ You are approved for placement!</div>
        )}
      </div>

      <div className="grid-2 gap-6">
        {/* Profile Form */}
        <div className="card">
          <h3 className="font-semibold mb-6">Academic Details</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Select University / College</label>
              <select className="form-select" value={collegeId} onChange={e => setCollegeId(e.target.value)} required>
                <option value="">-- Select --</option>
                {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Branch / Department</label>
              <input className="form-input" value={form.branch}
                onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
                placeholder="e.g. Computer Science" required />
            </div>
            <div className="form-group">
              <label className="form-label">CGPA (0–10)</label>
              <input className="form-input" type="number" step="0.01" min="0" max="10"
                value={form.cgpa} onChange={e => setForm(p => ({ ...p, cgpa: e.target.value }))}
                placeholder="e.g. 8.5" required />
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input className="form-input" value={form.skills}
                onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="form-group">
              <label className="form-label">Projects (one per line)</label>
              <textarea className="form-textarea" rows={4} value={form.projects}
                onChange={e => setForm(p => ({ ...p, projects: e.target.value }))}
                placeholder="E-commerce platform using MERN stack" />
            </div>
            <div className="form-group">
              <label className="form-label">Certifications (comma separated)</label>
              <input className="form-input" value={form.certifications}
                onChange={e => setForm(p => ({ ...p, certifications: e.target.value }))}
                placeholder="AWS Cloud, Google Analytics" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Saving…</> : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Resume Section */}
        <div className="card">
          <h3 className="font-semibold mb-6">Resume</h3>
          {profile?.resumeUrl ? (
            <div style={{ marginBottom: 20 }}>
              <div className="alert alert-success">✓ Resume uploaded</div>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                View Resume
              </a>
              <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={handleDeleteResume}>
                Remove Resume
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted mb-4">No resume uploaded. Please upload a PDF (max 5MB).</p>
          )}

          <div className="form-group">
            <label className="form-label">Upload New Resume (PDF only)</label>
            <input type="file" accept=".pdf" className="form-input"
              onChange={e => setFile(e.target.files[0])} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleResumeUpload} disabled={!file || uploading}>
            {uploading ? <><span className="spinner" /> Uploading…</> : 'Upload Resume'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
