import { useState, useEffect } from 'react';
import API from '../utils/api';
import Navbar from '../components/Navbar';

function AgentDashboard() {
  const [orders, setOrders] = useState([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => { try { const res = await API.get('/agent/orders'); setOrders(res.data); } catch(e) {} };
  const updateStatus = async (orderId, status) => { await API.put(`/agent/orders/${orderId}/status`, { status }); alert(`Status updated to ${status}`); fetchOrders(); };
  const updateLocation = async () => { await API.put('/agent/location', { lat, lng }); alert('Location updated!'); };

  const btnStyle = { padding: '6px 12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px', marginTop: '5px' };
  const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', marginRight: '10px' };
  const cardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' };

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2>Agent Dashboard</h2>
        <div style={cardStyle}>
          <h3>Update My Location</h3>
          <input placeholder="Latitude" style={inputStyle} onChange={e => setLat(e.target.value)} />
          <input placeholder="Longitude" style={inputStyle} onChange={e => setLng(e.target.value)} />
          <button style={btnStyle} onClick={updateLocation}>Update Location</button>
        </div>
        <div style={cardStyle}>
          <h3>My Deliveries</h3>
          {orders.length === 0 && <p>No deliveries assigned!</p>}
          {orders.map(o => (
            <div key={o.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
              <p><b>Order #{o.id}</b> — Current Status: <b>{o.status}</b></p>
              <p>Type: {o.order_type} | Payment: {o.payment_type} | Charge: ₹{o.charge}</p>
              <div style={{ marginTop: '10px' }}>
                <button style={btnStyle} onClick={() => updateStatus(o.id, 'Picked Up')}>Picked Up</button>
                <button style={btnStyle} onClick={() => updateStatus(o.id, 'In Transit')}>In Transit</button>
                <button style={btnStyle} onClick={() => updateStatus(o.id, 'Out for Delivery')}>Out for Delivery</button>
                <button style={{ ...btnStyle, background: 'green' }} onClick={() => updateStatus(o.id, 'Delivered')}>Delivered</button>
                <button style={{ ...btnStyle, background: 'red' }} onClick={() => updateStatus(o.id, 'Failed')}>Failed</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
