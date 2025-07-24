import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '772559724147-utfpmphmr81s84n2eao0fnl7likdp79r.apps.googleusercontent.com';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [agree, setAgree] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('medimeal_user'));
    if (user && user.email) {
      navigate('/recommend');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { name, email, password });
      setMsg(res.data.message);
      if (res.data.message && res.data.message.toLowerCase().includes('signup successful')) {
        localStorage.setItem('medimeal_user', JSON.stringify({ name, email }));
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-title">Sign Up</div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="mb-3">
            <label className="auth-label">Name</label>
            <input
              type="text"
              className="form-control auth-input"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="form-control auth-input"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="form-control auth-input"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3" style={{ marginBottom: '1.2rem' }}>
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="terms" style={{ color: '#1a237e', fontSize: '0.97rem' }}>
              I agree to the <a href="/terms.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', textDecoration: 'underline' }}>Terms and Conditions</a>
            </label>
          </div>
          {showTermsError && (
            <div className="auth-alert" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              You must agree to the Terms and Conditions to sign up.
            </div>
          )}
          <button className="auth-btn" type="submit" disabled={!name || !email || !password}>Sign Up</button>
          {msg && <div className="alert alert-info auth-alert">{msg}</div>}
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '1rem' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#1a237e', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                fetch('http://localhost:5000/api/google-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential })
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.email) {
                      localStorage.setItem('medimeal_user', JSON.stringify({ name: data.name, email: data.email }));
                      navigate('/recommend');
                    } else {
                      alert('Google sign up failed.');
                    }
                  });
              }}
              onError={() => {
                alert('Google Sign In Failed');
              }}
              width="100%"
              size="large"
              text="signup_with"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}