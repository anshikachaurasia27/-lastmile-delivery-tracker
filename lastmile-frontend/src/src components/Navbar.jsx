import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px 20px', background: '#1a1a2e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>🚚 LastMile Tracker</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user.role === 'admin' && <Link to="/admin" style={{ color: 'white' }}>Admin</Link>}
        {user.role === 'customer' && <Link to="/customer" style={{ color: 'white' }}>My Orders</Link>}
        {user.role === 'agent' && <Link to="/agent" style={{ color: 'white' }}>My Deliveries</Link>}
        <button onClick={logout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;