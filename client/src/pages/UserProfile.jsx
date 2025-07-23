import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem('medimeal_user'));

  useEffect(() => {
    if (user && user.email) {
      axios.get(`http://localhost:5000/api/user-input/history?email=${encodeURIComponent(user.email)}`)
        .then(res => setHistory(res.data.history || []));
    }
  }, [user]);

  function renderInput(input) {
    if (Array.isArray(input)) {
      // If input is an array of characters, join as string
      return input.join('');
    } else if (typeof input === 'object' && input !== null) {
      return Object.entries(input).map(([key, value]) => (
        <div key={key}><b>{key}:</b> {value}</div>
      ));
    } else {
      return input;
    }
  }

  return (
    <div className="user-profile-history" style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #bbf7d0 0%, #22c55e 100%)', padding: '0' }}>
      <div style={{ width: '100%', maxWidth: 1000, minHeight: '80vh', background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(52,211,153,0.10)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h2 style={{ color: '#22c55e', textAlign: 'center' }}>Your Input History</h2>
        {history.length === 0 && <div style={{ textAlign: 'center', color: '#64748b' }}>No history found.</div>}
        <div style={{ width: '100%' }}>
        {history.map((entry, idx) => (
          <div key={entry._id || idx} className="history-card" style={{ background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px rgba(52,211,153,0.10)', padding: '1.1rem 1.3rem', margin: '1.2rem 0' }}>
            <div style={{ color: '#22c55e', fontWeight: 500, marginBottom: 6 }}><b>Date:</b> {new Date(entry.createdAt).toLocaleDateString()}</div>
            <div style={{ color: '#334155', fontSize: '1.05rem', marginBottom: 8 }}>
              <b>Input:</b><br/>
              {renderInput(entry.input)}
            </div>
            <div style={{ color: '#334155', fontSize: '1.05rem' }}>
              <b>Recommendations:</b>
              <pre style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: 8, margin: 0 }}>
                {entry.recommendations ? JSON.stringify(entry.recommendations, null, 2) : 'N/A'}
              </pre>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
} 