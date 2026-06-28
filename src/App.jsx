import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    aptitudeHours: '',
    sqlHours: '',
    codingHours: '',
    conceptLearned: '',
  });

  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const response = await fetch('http://localhost:5000/api/log-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          aptitudeHours: Number(formData.aptitudeHours),
          sqlHours: Number(formData.sqlHours),
          codingHours: Number(formData.codingHours),
          conceptLearned: formData.conceptLearned,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, message: '🚀 Entry logged to Google Sheets!', error: false });
        setFormData({ name: '', aptitudeHours: '', sqlHours: '', codingHours: '', conceptLearned: '' });
      } else {
        setStatus({ loading: false, message: data.error || 'Something went wrong.', error: true });
      }
    } catch{
      setStatus({ loading: false, message: 'Could not connect to backend server. Is it running?', error: true });
    }
  };

  return (
    <div className="container">
      <h2>Daily Study Tracker</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Aptitude Hours:</label>
          <input type="number" name="aptitudeHours" step="0.1" min="0" value={formData.aptitudeHours} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>SQL Hours:</label>
          <input type="number" name="sqlHours" step="0.1" min="0" value={formData.sqlHours} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Coding Hours:</label>
          <input type="number" name="codingHours" step="0.1" min="0" value={formData.codingHours} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Concept Learned:</label>
          <textarea name="conceptLearned" placeholder="e.g. SQL Joins, Binary Search..." value={formData.conceptLearned} onChange={handleChange} required />
        </div>

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Submitting...' : 'Submit Entry'}
        </button>
      </form>

      {status.message && (
        <p className={`status-message ${status.error ? 'error' : 'success'}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}

export default App;