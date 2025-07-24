import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GeminiRecommend.css';

export default function GeminiRecommend() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    foodType: '',
    bmi: '',
    weight: '',
    height: '',
    medication: '',
    disease: ''
  });
  const [step, setStep] = useState(0); // 0: age, 1: gender, 2: food type, 3: BMI, 4: medication, 5: disease, 6: recommendations
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bmiCategory, setBmiCategory] = useState('');
  const [openCard, setOpenCard] = useState(null);
  const [likes, setLikes] = useState({ Breakfast: false, Lunch: false, Dinner: false });
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [foodToCheck, setFoodToCheck] = useState('');
  const [foodCheckResult, setFoodCheckResult] = useState(null);
  const [foodCheckLoading, setFoodCheckLoading] = useState(false);
  const [foodMeal, setFoodMeal] = useState('breakfast');
  const [foodPortion, setFoodPortion] = useState('');
  const [bmiWarning, setBmiWarning] = useState('');
  const [submitError, setSubmitError] = useState('');

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
    const height = parseFloat(form.height) / 100;
    if (weight > 0 && height > 0) {
      let bmi = (weight / (height * height)).toFixed(1);
      if (bmi > 60) {
        setBmiWarning('BMI above 60 is not realistic. Please check your input.');
        bmi = 60;
      } else {
        setBmiWarning('');
      }
      setForm(f => ({ ...f, bmi }));
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

  const handleSubmit = async () => {
    setSubmitError('');
    if (parseFloat(form.bmi) > 60) {
      setBmiWarning('BMI above 60 is not realistic. Please check your input.');
      setSubmitError('BMI above 60 is not realistic. Please check your input.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/gemini-recommend', form);
      if (res.data && res.data.error) {
        setSubmitError(res.data.error);
        setLoading(false);
        return;
      }
      setResult(res.data);
      const user = JSON.parse(localStorage.getItem('medimeal_user'));
      if (user && user.email) {
        axios.post('http://localhost:5000/api/user-input', {
          email: user.email,
          input: form,
          recommendations: res.data
        });
      }
    } catch (err) {
      setSubmitError('Failed to get recommendations. Please try again.');
      setResult({ error: 'Failed to get recommendations.' });
    }
    setLoading(false);
  };

  const handleFoodCheck = async () => {
    if (parseFloat(form.bmi) > 60) {
      setBmiWarning('BMI above 60 is not realistic. Please check your input.');
      return;
    }
    setFoodCheckLoading(true);
    setFoodCheckResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/food-evaluate', {
        ...form,
        food: foodToCheck,
        meal: foodMeal,
        portion: foodPortion
      });
      setFoodCheckResult(res.data);
    } catch {
      setFoodCheckResult({ is_good: false, reason: 'Failed to evaluate food.' });
    }
    setFoodCheckLoading(false);
  };

  const stepIcons = ['👤', '🚻', '🥗', '⚖️', '💊', '🩺', '🍽️'];
  const totalSteps = 7;

  return (
    <div className="auth-bg gemini-recommend-outer">
      {!(step <= 6 && !result) && (
        <h2>Get Food Recommendations</h2>
      )}
      {step <= 6 && !result && (
        <>
          {step === 0 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[0]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Enter your Age</label>
              <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required className="step-input" />
              <button onClick={() => form.age && setStep(1)} disabled={!form.age} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 1 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[1]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Select your Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required className="step-input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <button onClick={() => form.gender && setStep(2)} disabled={!form.gender} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 2 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[2]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Select your Food Type</label>
              <select name="foodType" value={form.foodType} onChange={handleChange} required className="step-input">
                <option value="">Select Food Type</option>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
                <option value="vegan">Vegan</option>
              </select>
              <button onClick={() => form.foodType && setStep(3)} disabled={!form.foodType} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 3 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[3]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Enter your BMI (or calculate below)</label>
              <input name="bmi" type="number" step="0.1" placeholder="BMI (optional)" value={form.bmi} onChange={handleChange} className="step-input" />
              <div className="bmi-calc-row">
                <input name="weight" type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} className="bmi-input" />
                <input name="height" type="number" step="0.1" placeholder="Height (cm)" value={form.height} onChange={handleChange} className="bmi-input" />
                <button type="button" onClick={handleCalculateBMI} className="bmi-btn">Calculate BMI</button>
              </div>
              {bmiCategory && <div className="bmi-category">{bmiCategory}</div>}
              {bmiWarning && (
                <div style={{ color: '#a21a1a', background: '#ffeaea', padding: '0.7rem 1rem', borderRadius: '7px', margin: '0.7rem 0', fontWeight: 500, textAlign: 'center' }}>{bmiWarning}</div>
              )}
              <button onClick={() => setStep(4)} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 4 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[4]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Enter your Medication</label>
              <input name="medication" placeholder="Medication" value={form.medication} onChange={handleChange} required className="step-input" />
              <button onClick={() => form.medication && setStep(5)} disabled={!form.medication} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 5 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[5]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <label>Enter your Disease</label>
              <input name="disease" placeholder="Disease" value={form.disease} onChange={handleChange} required className="step-input" />
              <button onClick={() => form.disease && setStep(6)} disabled={!form.disease} className="step-btn">Next</button>
            </div></div>
          )}
          {step === 6 && (
            <div className="modal-overlay"><div className="modal-content step-modal">
              <div className="step-icon">{stepIcons[6]}</div>
              <div className="stepper">
                <div className="stepper-bar"><div className="stepper-progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
                <span className="stepper-label">Step {step + 1} of {totalSteps}</span>
              </div>
              <button onClick={handleSubmit} disabled={loading || !!bmiWarning} className="step-btn">Get Recommendations</button>
              {(loading || !!bmiWarning || !!submitError) && (
                <div style={{ color: '#a21a1a', background: '#ffeaea', padding: '0.7rem 1rem', borderRadius: '7px', margin: '0.7rem 0', fontWeight: 500, textAlign: 'center' }}>
                  {loading && 'Loading...'}
                  {bmiWarning && bmiWarning}
                  {submitError && submitError}
                </div>
              )}
            </div></div>
          )}
        </>
      )}
      {loading && (
        <div className="recommend-spinner">
          <div className="spinner"></div>
        </div>
      )}
      {result && (
        <div className="recommend-results">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                style={{
                  padding: '0.7rem 2.2rem',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '2rem',
                  border: selectedMeal === meal ? '2.5px solid #1a237e' : '1.5px solid #b0bec5',
                  background: selectedMeal === meal ? '#e3f2fd' : '#fff',
                  color: selectedMeal === meal ? '#1a237e' : '#263238',
                  cursor: 'pointer',
                  boxShadow: selectedMeal === meal ? '0 2px 8px rgba(26,35,126,0.10)' : 'none',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
              >
                {meal}
              </button>
            ))}
          </div>
          <div className={`recommend-card ${selectedMeal.toLowerCase()}-card`}>
            <h3>{selectedMeal}</h3>
            <h4>Recommended:</h4>
            <ul>
              {result[selectedMeal.toLowerCase()]?.recommended?.map((item, idx) =>
                <li key={idx}>{item.food} - {item.quantity}</li>
              )}
            </ul>
            <h4>Not Recommended:</h4>
            <ul>
              {result[selectedMeal.toLowerCase()]?.not_recommended?.map((food, idx) =>
                <li key={idx}>{food}</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {/* Food Evaluation Section */}
      {result && (
        <div className="food-evaluate-section" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: '#1a237e', marginBottom: '1rem' }}>Check Any Food for Your Health</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
            <input
              type="text"
              placeholder="Enter food name (e.g., banana)"
              value={foodToCheck}
              onChange={e => setFoodToCheck(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '7px', border: '1.5px solid #b0bec5', fontSize: '1rem', width: '180px' }}
            />
            <select
              value={foodMeal}
              onChange={e => setFoodMeal(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '7px', border: '1.5px solid #b0bec5', fontSize: '1rem' }}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <input
              type="text"
              placeholder="Portion (e.g., 2 eggs)"
              value={foodPortion}
              onChange={e => setFoodPortion(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '7px', border: '1.5px solid #b0bec5', fontSize: '1rem', width: '120px' }}
            />
            <button
              onClick={handleFoodCheck}
              disabled={!foodToCheck || foodCheckLoading}
              style={{ padding: '0.5rem 1.5rem', borderRadius: '7px', background: '#1a237e', color: '#fff', fontWeight: 600, border: 'none', fontSize: '1rem', cursor: 'pointer' }}
            >
              {foodCheckLoading ? 'Checking...' : 'Check Food'}
            </button>
          </div>
          {foodCheckResult && (
            <div style={{ marginTop: '1rem', padding: '1.1rem 1.5rem', borderRadius: '10px', background: foodCheckResult.is_good ? '#e3fbe3' : '#ffeaea', color: foodCheckResult.is_good ? '#1a7e23' : '#a21a1a', display: 'inline-block', minWidth: '260px', fontSize: '1.1rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.3rem', marginRight: '0.5rem' }}>{foodCheckResult.is_good ? '✅' : '❌'}</span>
              {foodCheckResult.is_good ? 'Good for your health!' : 'Not good for your health.'}
              <div style={{ fontSize: '0.98rem', color: '#222', marginTop: '0.5rem', fontWeight: 400 }}>{foodCheckResult.reason}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 