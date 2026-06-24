import { useState } from 'react';
import { api } from '../services/api';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);


  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const validationErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!credentials.email) {
      validationErrors.email = 'Email is required';
    } else if (!emailRegex.test(credentials.email)) {
      validationErrors.email = 'Please enter a valid email';
    }

    if (!credentials.password) {
      validationErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!credentials.name.trim()) {
        validationErrors.name = 'Name is required';
      }
      if (credentials.password !== credentials.confirmPassword) {
        validationErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      if (isLogin) {
        const data = await api.auth.login(credentials.email, credentials.password);
        onLoginSuccess(data);
      } else {
        const data = await api.auth.register(
          credentials.name,
          credentials.email,
          credentials.password
        );
        onLoginSuccess(data);
      }
    } catch (err) {
      setApiError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCredentials({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setApiError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
            <div className="logo-icon">SS</div>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter credentials to access dashboard' : 'Sign up to manage employee workspace'}</p>
        </div>

        {apiError && (
          <div className="alert-banner alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <UserIcon />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="John Doe"
                  value={credentials.name}
                  onChange={onFieldChange}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <MailIcon />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="input-control"
                style={{ paddingLeft: '38px' }}
                placeholder="you@example.com"
                value={credentials.email}
                onChange={onFieldChange}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                <LockIcon />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="input-control"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={credentials.password}
                onChange={onFieldChange}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <LockIcon />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={credentials.confirmPassword}
                  onChange={onFieldChange}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', height: '44px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={toggleAuthMode} className="btn-text" style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: '600' }}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleAuthMode} className="btn-text" style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: '600' }}>
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
