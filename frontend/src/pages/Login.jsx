import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { healthApi } from '../services/api';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldAlert, 
  UserPlus, 
  LogIn, 
  CheckCircle2 
} from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('CUSTOMER');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Instant pre-warming of backend as soon as user opens login screen
  useEffect(() => {
    healthApi.check().catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        user = await register(name, email, password, 'CUSTOMER');
      } else {
        user = await login(email, password);
      }

      // Role-based smart redirection
      if (user.role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else if (user.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || (isSignUp ? 'Registration failed.' : 'Login failed. Please verify credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo-icon" style={{ margin: '0 auto', width: '48px', height: '48px', fontSize: '1.5rem' }}>
            Q
          </div>
          <h2>BankQ Portal</h2>
          <p>Digital Queue Management System</p>
        </div>

        {/* Tab switch between Sign In and Sign Up */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.25rem',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: !isSignUp ? '#0f2744' : 'transparent',
              color: !isSignUp ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setSuccess('');
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: isSignUp ? '#0f2744' : 'transparent',
              color: isSignUp ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setSuccess('');
            }}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder={isSignUp ? "yourname@example.com" : "name@bankq.demo"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder={isSignUp ? "Minimum 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="role">Account Role</label>
              <input
                id="role"
                type="text"
                className="form-input"
                value="Customer"
                readOnly
                style={{
                  background: '#f8fafc',
                  color: '#0f2744',
                  fontWeight: 600,
                  cursor: 'default',
                  border: '1.5px solid #e2e8f0'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading
              ? (isSignUp ? 'Creating your account...' : 'Authenticating...')
              : (isSignUp ? 'Sign Up & Enter BankQ' : 'Sign In to BankQ')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          {isSignUp ? (
            <span>
              Already have credentials?{' '}
              <button
                type="button"
                style={{ color: '#0284c7', fontWeight: 700 }}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to BankQ?{' '}
              <button
                type="button"
                style={{ color: '#0284c7', fontWeight: 700 }}
                onClick={() => setIsSignUp(true)}
              >
                Create your own account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
