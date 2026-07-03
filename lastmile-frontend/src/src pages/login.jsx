import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'customer') navigate('/customer');
      else navigate('/agent');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', width: '350px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🚚 LastMile Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Login
        </button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;