import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken]     = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Persist to localStorage on change
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else       localStorage.removeItem('token');
    if (user)  localStorage.setItem('user', JSON.stringify(user));
    else       localStorage.removeItem('user');
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(payload);
      setToken(data.token);
      setUser(data.user);
      return { ok: true, role: data.user.role };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
