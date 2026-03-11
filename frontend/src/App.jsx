import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !email) return alert('Please provide a file and email.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    setStatus('loading');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/generate-insight`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif', textAlign: 'left', padding: '20px', backgroundColor: '#242424', borderRadius: '8px', color: 'white' }}>
      <h2>Sales Insight Automator</h2>
      <p>Upload your quarterly CSV/XLSX to receive an instant executive brief.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="file" 
          accept=".csv, .xlsx" 
          onChange={(e) => setFile(e.target.files[0])} 
          disabled={status === 'loading'}
          style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '4px', color: 'white' }}
        />
        <input 
          type="email" 
          placeholder="Recipient Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '4px', color: 'white' }}
        />
        <button type="submit" disabled={status === 'loading'} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          {status === 'loading' ? 'Processing via AI...' : 'Generate & Send Insight'}
        </button>
      </form>

      {status === 'success' && <p style={{ color: '#4ade80', marginTop: '20px', fontWeight: 'bold' }}>✓ {message}</p>}
      {status === 'error' && <p style={{ color: '#f87171', marginTop: '20px', fontWeight: 'bold' }}>✗ {message}</p>}
    </div>
  )
}

export default App