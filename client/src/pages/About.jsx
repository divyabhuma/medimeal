import React from 'react';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #bbf7d0 0%, #22c55e 100%)', padding: '2rem 0' }}>
      <div className="about-main fade-in" style={{ maxWidth: 900, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(52,211,153,0.10)', padding: '2rem', margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#22c55e', textAlign: 'center' }}>About Medimeal</h2>
        <p style={{ fontSize: '1.1rem', color: '#334155', textAlign: 'center' }}>
          <b>Medimeal</b> is your AI-powered health companion, providing personalized food recommendations based on your age, medication, disease, and gender. Our mission is to help you eat smarter, feel better, and take control of your wellness journey with the help of advanced AI technology.
        </p>
        <ul style={{ color: '#166534', fontSize: '1.05rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <li>Personalized meal plans tailored to your health profile</li>
          <li>AI-driven recommendations for safe and healthy eating</li>
          <li>Easy-to-use interface and instant access to your meal plans</li>
          <li>Supports a variety of health conditions and medications</li>
        </ul>
        <div className="about-testimonials slide-up" style={{ marginTop: '2.5rem', width: '100%' }}>
          <h3 style={{ color: '#22c55e', marginBottom: '1.2rem', textAlign: 'center' }}>What Our Users Say</h3>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ background: '#f0fdf4', borderRadius: 12, boxShadow: '0 2px 8px rgba(52,211,153,0.10)', padding: '1.1rem 1.3rem', minWidth: 180, maxWidth: 220 }}>
              <div style={{ fontSize: '1.1rem', color: '#166534', fontStyle: 'italic' }}>
                "Medimeal helped me manage my diabetes with easy meal suggestions. Love the AI!"
              </div>
              <div style={{ marginTop: 8, color: '#22c55e', fontWeight: 500 }}>— Priya, 34</div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: 12, boxShadow: '0 2px 8px rgba(52,211,153,0.10)', padding: '1.1rem 1.3rem', minWidth: 180, maxWidth: 220 }}>
              <div style={{ fontSize: '1.1rem', color: '#166534', fontStyle: 'italic' }}>
                "I finally found food advice that considers my medication. Highly recommended!"
              </div>
              <div style={{ marginTop: 8, color: '#22c55e', fontWeight: 500 }}>— Rahul, 52</div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: 12, boxShadow: '0 2px 8px rgba(52,211,153,0.10)', padding: '1.1rem 1.3rem', minWidth: 180, maxWidth: 220 }}>
              <div style={{ fontSize: '1.1rem', color: '#166534', fontStyle: 'italic' }}>
                "Simple, fast, and effective. My energy and health have improved!"
              </div>
              <div style={{ marginTop: 8, color: '#22c55e', fontWeight: 500 }}>— Anjali, 28</div>
            </div>
          </div>
        </div>
        <div className="about-pricing fade-in" style={{ width: '100%', marginTop: '3rem' }}>
          <h2 style={{ textAlign: 'center', color: '#22c55e', marginBottom: '1.5rem' }}>Choose Your Plan</h2>
          <div className="pricing-cards">
            <div className="pricing-card normal">
              <h3>Normal</h3>
              <ul>
                <li>Personalized food recommendations</li>
                <li>Rule-based engine</li>
                <li>Basic AI Q&A</li>
                <li>Access to meal timeline</li>
              </ul>
              <div className="pricing-price">Free</div>
              <button className="pricing-btn">Start Free</button>
            </div>
            <div className="pricing-card premium best-value">
              <h3>Premium</h3>
              <ul>
                <li>All Normal features</li>
                <li>Advanced AI assistant</li>
                <li>Priority support</li>
                <li>Alternative food suggestions</li>
                <li>Upload medical reports</li>
                <li>Unlimited recommendations</li>
                <li>Personal dietitian Q&A</li>
                <li>Early access to new features</li>
              </ul>
              <div className="pricing-price">₹199/mo <span style={{ color: '#64748b', fontSize: '0.95rem' }}>(or $2.49/mo)</span></div>
              <button className="pricing-btn premium">Go Premium</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 