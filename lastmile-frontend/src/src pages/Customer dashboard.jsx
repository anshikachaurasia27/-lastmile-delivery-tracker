import { useState, useEffect } from 'react';
import API from '../utils/api';
import Navbar from '../components/Navbar';

function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({ pickup_area: '', drop_area: '', L: '', B: '', H: '', actual_weight: '', order_type: 'B2C', payment_type: 'Prepaid', scheduled_date: '' });
  const [charge, setCharge] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [rescheduleId, setRescheduleId] = useState(null);

  useEffect(() => { fetchOrders(); fetchAreas(); }, []);

  const fetchOrders = async () => { try { const res = await API.get('/orders/my-orders'); setOrders(res.data); } catch(e) {} };
  const fetchAreas = async () => { try { const res = await API.get('/orders/areas'); setAreas(res.data); } catch(e) {} };
  const calculateCharge = async () => { try { const res = await API.post('/orders/calculate-charge', form); setCharge(res.data); } catch(e) { alert('Error calculating charge!'); } };
  const createOrder = async () => { try { await API.post('/orders/create', form); alert('Order created!'); setCharge(null); fetchOrders(); } catch(e) { alert('Error creating order!'); } };
  const viewTracking = async (id) => { const res = await API.get(`/orders/${id}/tracking`); setTracking(res.data); };
  const reschedule = async (id) => { await API.post(`/orders/${id}/reschedule`, { new_date: newDate }); alert('Rescheduled!'); fetchOrders(); setRescheduleId(null); };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
  const btnStyle = { padding: '8px 15px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' };
  const cardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' };

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Customer Dashboard</h2>
        <div style={cardStyle}>
          <h3>Place New Order</h3>
          <select style={inputStyle} onChange={e => setForm({ ...form, pickup_area: e.target.value })}>
            <option value="">Select Pickup Area</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select style={inputStyle} onChange={e => setForm({ ...form, drop_area: e.target.value })}>
            <option value="">Select Drop Area</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input placeholder="Length (cm)" style={inputStyle} onChange={e => setForm({ ...form, L: e.target.value })} />
            <input placeholder="Breadth (cm)" style={inputStyle} onChange={e => setForm({ ...form, B: e.target.value })} />
            <input placeholder="Height (cm)" style={inputStyle} onChange={e => setForm({ ...form, H: e.target.value })} />
          </div>
          <input placeholder="Actual Weight (kg)" style={inputStyle} onChange={e => setForm({ ...form, actual_weight: e.target.value })} />
          <select style={inputStyle} onChange={e => setForm({ ...form, order_type: e.target.value })}>
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>
          <select style={inputStyle} onChange={e => setForm({ ...form, payment_type: e.target.value })}>
            <option value="Prepaid">Prepaid</option>
            <option value="COD">COD</option>
          </select>
          <input type="date" style={inputStyle} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
          <button style={btnStyle} onClick={calculateCharge}>Calculate Charge</button>
          {charge && (
            <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
              <p>Volumetric Weight: <b>{charge.volumetricWeight} kg</b></p>
              <p>Billed Weight: <b>{charge.billedWeight} kg</b></p>
              <p>Total Charge: <b>₹{charge.charge}</b></p>
              <button style={{ ...btnStyle, background: 'green' }} onClick={createOrder}>Confirm & Place Order</button>
            </div>
          )}
        </div>
        <div style={cardStyle}>
          <h3>My Orders</h3>
          {orders.length === 0 && <p>No orders yet!</p>}
          {orders.map(o => (
            <div key={o.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
              <p><b>Order #{o.id}</b> — {o.status} — ₹{o.charge}</p>
              <p>Type: {o.order_type} | Payment: {o.payment_type}</p>
              <button style={btnStyle} onClick={() => viewTracking(o.id)}>Track Order</button>
              {o.status === 'Failed' && (
                <button style={{ ...btnStyle, background: 'orange' }} onClick={() => setRescheduleId(o.id)}>Reschedule</button>
              )}
              {rescheduleId === o.id && (
                <div style={{ marginTop: '10px' }}>
                  <input type="date" style={{ ...inputStyle, width: 'auto' }} onChange={e => setNewDate(e.target.value)} />
                  <button style={{ ...btnStyle, background: 'green' }} onClick={() => reschedule(o.id)}>Confirm Reschedule</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {tracking && (
          <div style={cardStyle}>
            <h3>Tracking Timeline — Order #{tracking.order?.id}</h3>
            {tracking.timeline.map((log, i) => (
              <div key={i} style={{ padding: '10px', borderLeft: '3px solid #1a1a2e', marginBottom: '10px', paddingLeft: '15px' }}>
                <p><b>{log.status}</b></p>
                <p style={{ color: 'gray', fontSize: '12px' }}>{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;