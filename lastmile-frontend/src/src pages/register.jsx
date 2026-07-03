import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email already exists?');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📝 Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input
          placeholder="Full Name"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <select
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="agent">Delivery Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Register
        </button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;