import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Student');
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'Student', collegeId: '', collegeIds: [] });
  const [error, setError] = useState('');
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    authAPI.getColleges()
      .then(res => setColleges(res.data.colleges || []))
      .catch(console.error);
  }, []);

  // Update role dynamically when tab is switched
  const switchTab = (role) => {
    setActiveTab(role);
    setForm(p => ({ ...p, role, name: '', email: '', password: '', collegeId: '', collegeIds: [] }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Front-end validation for college selection
    if (form.role === 'Student' && !form.collegeId) {
      return setError('Please carefully select your enrolled University/College');
    }

    const res = await register({
      ...form, 
      collegeId: form.role === 'Student' ? form.collegeId : undefined,
      collegeIds: form.role === 'Recruiter' ? form.collegeIds : undefined
    });
    if (res.ok) {
      const routes = { Student: '/student', Recruiter: '/recruiter', College: '/college' };
      navigate(routes[res.role] || '/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Prashikshan</h1>
          <p>Academia Industry Interface</p>
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Create account</h2>
        <p className="text-muted text-sm mb-6">Join the platform today</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-glass)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {['Student', 'Recruiter', 'College'].map(role => (
            <button 
              key={role}
              type="button"
              onClick={() => switchTab(role)}
              style={{
                flex: 1, padding: '8px 12px', fontSize: '0.9rem', fontWeight: 600,
                borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === role ? 'var(--primary)' : 'transparent',
                color: activeTab === role ? '#fff' : 'var(--text-muted)'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeTab === 'Student' ? 'Student Full Name' : 
               activeTab === 'Recruiter' ? 'Recruiter Full Name' : 
               'University / College Legal Name'}
            </label>
            <input id="reg-name" className="form-input" type="text" placeholder="John Doe"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">
              {activeTab === 'Student' ? 'Personal Email Address' : 
               activeTab === 'Recruiter' ? 'Work Email Address' : 
               'Official TPO Email'}
            </label>
            <input id="reg-email" className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Secure Password</label>
            <input id="reg-password" className="form-input" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
          </div>

          {activeTab === 'Student' && (
            <div className="form-group">
              <label className="form-label">Select Your University / College</label>
              <select 
                className="form-select" 
                value={form.collegeId} 
                onChange={e => setForm(p => ({ ...p, collegeId: e.target.value }))} 
                required
              >
                <option value="">-- Choose explicitly --</option>
                {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <button id="reg-submit" type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
