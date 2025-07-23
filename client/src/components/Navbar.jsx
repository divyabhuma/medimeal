import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('medimeal_user'));

  const handleLogout = () => {
    localStorage.removeItem('medimeal_user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">Medimeal</Link>
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/about" className="navbar-link">About</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="navbar-profile">
            <span className="navbar-user-icon">👤</span>
            <Link to="/profile" className="navbar-username" style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer' }}>
              {user.name ? user.name : 'User'}
            </Link>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
} 