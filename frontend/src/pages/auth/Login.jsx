import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
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

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Welcome back</h2>
        <p className="text-muted text-sm mb-6">Sign in to your account</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                className="form-input"
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingRight: '42px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)' }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button id="login-submit" type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
