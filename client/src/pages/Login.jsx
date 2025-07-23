import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
// import logo from '../assets/medimeal-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('medimeal_user'));
    if (user && user.email) {
      navigate('/recommend');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      setMsg(res.data.message);
      // Redirect to landing page after successful login
      if (res.data.message && res.data.message.toLowerCase().includes('login successful')) {
        // Store user info in localStorage (prefer name if available)
        const userName = res.data.name || email;
        localStorage.setItem('medimeal_user', JSON.stringify({ name: userName, email }));
        setTimeout(() => navigate('/recommend'), 1000); // 1 second delay for feedback
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-bg">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <img src={logo} alt="Medimeal Logo" style={{ width: 120, margin: '2rem auto 1rem auto', display: 'block' }} /> */}
        <div className="auth-card">
          <div className="auth-title">Login</div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            <button className="auth-btn" type="submit">Login</button>
            {msg && <div className="alert alert-info auth-alert">{msg}</div>}
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '1rem' }}>
            Don't have an account?{' '}
            <span
              style={{ color: '#22c55e', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}