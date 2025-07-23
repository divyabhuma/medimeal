import React, { useState } from 'react';

const initialProfile = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  eaterType: '',
  medications: [{ name: '', dosage: '', duration: '' }],
  diseaseDuration: '',
  unavailableFoods: [],
};

const steps = [
  'Basic Info',
  'Medications',
  'Disease & Food Availability',
  'Review',
];

export default function ProfileWizard() {
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState(0);

  const handleChange = (field, value) => setProfile(p => ({ ...p, [field]: value }));
  const handleMedChange = (idx, field, value) => {
    const meds = [...profile.medications];
    meds[idx][field] = value;
    setProfile(p => ({ ...p, medications: meds }));
  };
  const addMedication = () => setProfile(p => ({ ...p, medications: [...p.medications, { name: '', dosage: '', duration: '' }] }));
  const removeMedication = idx => setProfile(p => ({ ...p, medications: profile.medications.filter((_, i) => i !== idx) }));
  const handleUnavailableFood = food => {
    setProfile(p => ({ ...p, unavailableFoods: p.unavailableFoods.includes(food) ? p.unavailableFoods.filter(f => f !== food) : [...p.unavailableFoods, food] }));
  };
  const bmi = profile.height && profile.weight ? (profile.weight / ((profile.height/100) ** 2)).toFixed(1) : '';

  return (
    <div className="profile-wizard-container">
      <div className="wizard-progress">
        {steps.map((s, i) => (
          <div key={i} className={`wizard-step${i === step ? ' active' : ''}`}>{s}</div>
        ))}
      </div>
      {step === 0 && (
        <div className="wizard-step-content">
          <h3>Basic Info</h3>
          <label>Gender
            <select value={profile.gender} onChange={e => handleChange('gender', e.target.value)} required>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label>Age
            <input type="number" value={profile.age} onChange={e => handleChange('age', e.target.value)} required />
          </label>
          <label>Height (cm)
            <input type="number" value={profile.height} onChange={e => handleChange('height', e.target.value)} required />
          </label>
          <label>Weight (kg)
            <input type="number" value={profile.weight} onChange={e => handleChange('weight', e.target.value)} required />
          </label>
          <div>BMI: <b>{bmi}</b></div>
          <label>Type of Eater
            <select value={profile.eaterType} onChange={e => handleChange('eaterType', e.target.value)} required>
              <option value="">Select</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
            </select>
          </label>
        </div>
      )}
      {step === 1 && (
        <div className="wizard-step-content">
          <h3>Medications</h3>
          {profile.medications.map((med, idx) => (
            <div key={idx} className="medication-row">
              <input placeholder="Drug name" value={med.name} onChange={e => handleMedChange(idx, 'name', e.target.value)} required />
              <input placeholder="Dosage (e.g. 5mg/day)" value={med.dosage} onChange={e => handleMedChange(idx, 'dosage', e.target.value)} required />
              <input placeholder="Usage duration (e.g. 6 months)" value={med.duration} onChange={e => handleMedChange(idx, 'duration', e.target.value)} required />
              {profile.medications.length > 1 && <button type="button" onClick={() => removeMedication(idx)}>-</button>}
            </div>
          ))}
          <button type="button" onClick={addMedication}>+ Add Medication</button>
        </div>
      )}
      {step === 2 && (
        <div className="wizard-step-content">
          <h3>Disease & Food Availability</h3>
          <label>Disease Duration (e.g. 1 year)
            <input value={profile.diseaseDuration} onChange={e => handleChange('diseaseDuration', e.target.value)} required />
          </label>
          <label>Unavailable Foods (toggle):</label>
          <div className="food-toggle-list">
            {['Milk', 'Eggs', 'Wheat', 'Peanuts', 'Soy', 'Fish', 'Chicken', 'Rice', 'Potato', 'Tomato'].map(food => (
              <button key={food} type="button" className={profile.unavailableFoods.includes(food) ? 'food-unavailable' : ''} onClick={() => handleUnavailableFood(food)}>{food}</button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="wizard-step-content">
          <h3>Review Profile</h3>
          <pre style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8 }}>{JSON.stringify({ ...profile, bmi }, null, 2)}</pre>
          <button type="button" style={{ marginTop: 12 }}>Save Profile</button>
        </div>
      )}
      <div className="wizard-nav">
        {step > 0 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < steps.length - 1 && <button onClick={() => setStep(s => s + 1)}>Next</button>}
      </div>
    </div>
  );
} 