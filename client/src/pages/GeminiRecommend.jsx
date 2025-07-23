import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to split foods by veg/non-veg keywords
const splitVegNonVeg = (foods = []) => {
  const nonVegKeywords = ['chicken', 'fish', 'egg', 'mutton', 'beef', 'prawn', 'shrimp', 'meat', 'lamb', 'turkey', 'duck'];
  const veg = [];
  const nonveg = [];
  foods.forEach(food => {
    const lower = food.toLowerCase();
    if (nonVegKeywords.some(word => lower.includes(word))) {
      nonveg.push(food);
    } else {
      veg.push(food);
    }
  });
  return { veg, nonveg };
};

export default function GeminiRecommend() {
  const [form, setForm] = useState({ age: '', medication: '', disease: '', gender: '', foodType: '', bmi: '', weight: '', height: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bmiCategory, setBmiCategory] = useState('');

  // Load previous input for logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('medimeal_user'));
    if (user && user.email) {
      axios.get(`http://localhost:5000/api/user-input?email=${encodeURIComponent(user.email)}`)
        .then(res => {
          if (res.data.input) setForm(f => ({ ...f, ...res.data.input }));
        });
    }
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCalculateBMI = () => {
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height) / 100; // convert cm to m
    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setForm(f => ({ ...f, bmi }));
      // Gender-specific BMI categories (standard WHO for adults)
      let category = '';
      if (form.gender === 'Male' || form.gender === 'Female' || form.gender === 'Other') {
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
      }
      setBmiCategory(category ? `BMI Category (${form.gender}): ${category}` : '');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/gemini-recommend', form);
      setResult(res.data);
      // Save input and recommendations for user only if successful
      const user = JSON.parse(localStorage.getItem('medimeal_user'));
      if (user && user.email) {
        axios.post('http://localhost:5000/api/user-input', {
          email: user.email,
          input: form,
          recommendations: res.data
        });
      }
    } catch {
      setResult({ error: 'Failed to get recommendations.' });
    }
    setLoading(false);
  };

  const foodType = form.foodType || 'both';

  return (
    <div className="gemini-recommend-container">
      <h2>Get Food Recommendations</h2>
      <form onSubmit={handleSubmit} className="gemini-recommend-form">
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange} required className="gender-select">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select name="foodType" value={form.foodType} onChange={handleChange} required className="foodtype-select styled-select" style={{ marginBottom: '0.7rem' }}>
          <option value="">Select Food Type</option>
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
          <option value="both">Both</option>
        </select>
        <input name="bmi" type="number" step="0.1" placeholder="BMI (optional)" value={form.bmi} onChange={handleChange} className="bmi-input" />
        <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.7rem' }}>
          <input name="weight" type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} className="bmi-input" />
          <input name="height" type="number" step="0.1" placeholder="Height (cm)" value={form.height} onChange={handleChange} className="bmi-input" />
          <button type="button" onClick={handleCalculateBMI} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.1rem', fontWeight: 500, cursor: 'pointer' }}>Calculate BMI</button>
        </div>
        {bmiCategory && <div style={{ marginBottom: '0.7rem', color: '#166534', fontWeight: 500 }}>{bmiCategory}</div>}
        <input name="medication" placeholder="Medication" value={form.medication} onChange={handleChange} required />
        <input name="disease" placeholder="Disease" value={form.disease} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Get Recommendations'}</button>
      </form>
      {loading && (
        <div className="recommend-spinner">
          <div className="spinner"></div>
        </div>
      )}
      {result && (
        <div className="recommend-results">
          {result.error && <div className="recommend-alert">{result.error}</div>}
          <div className="recommend-cards-wrapper">
            {result.recommended && (
              <div className="recommend-card recommend-card-green">
                <h3>✅ Recommended Foods</h3>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {foodType !== 'nonveg' && (
                    <div>
                      <h4 style={{ color: '#16a34a' }}>Veg</h4>
                      <ul>
                        {splitVegNonVeg(result.recommended).veg.map((food, i) => (
                          <li key={i}><span className="food-icon">🥦</span> {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {foodType !== 'veg' && (
                    <div>
                      <h4 style={{ color: '#f59e42' }}>Non-Veg</h4>
                      <ul>
                        {splitVegNonVeg(result.recommended).nonveg.map((food, i) => (
                          <li key={i}><span className="food-icon">🍗</span> {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            {result.not_recommended && (
              <div className="recommend-card recommend-card-red">
                <h3>❌ Not Recommended Foods</h3>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {foodType !== 'nonveg' && (
                    <div>
                      <h4 style={{ color: '#16a34a' }}>Veg</h4>
                      <ul>
                        {splitVegNonVeg(result.not_recommended).veg.map((food, i) => (
                          <li key={i}><span className="food-icon">🥦</span> {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {foodType !== 'veg' && (
                    <div>
                      <h4 style={{ color: '#f59e42' }}>Non-Veg</h4>
                      <ul>
                        {splitVegNonVeg(result.not_recommended).nonveg.map((food, i) => (
                          <li key={i}><span className="food-icon">🍗</span> {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 