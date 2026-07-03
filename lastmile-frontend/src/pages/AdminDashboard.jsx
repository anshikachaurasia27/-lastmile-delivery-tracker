import { useState, useEffect } from 'react';
import API from '../utils/api';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [zones, setZones] = useState([]);
  const [zoneName, setZoneName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [areaZone, setAreaZone] = useState('');
  const [rateCard, setRateCard] = useState({ zone_from: '', zone_to: '', order_type: 'B2B', rate_per_kg: '', cod_surcharge: '' });
  const [agentId, setAgentId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => { fetchOrders(); fetchZones(); }, []);

  const fetchOrders = async () => { try { const res = await API.get('/admin/orders'); setOrders(res.data); } catch(e) {} };
  const fetchZones = async () => { try { const res = await API.get('/admin/zones'); setZones(res.data); } catch(e) {} };
  const createZone = async () => { await API.post('/admin/zones', { name: zoneName }); setZoneName(''); fetchZones(); alert('Zone created!'); };
  const createArea = async () => { await API.post('/admin/areas', { name: areaName, zone_id: areaZone }); setAreaName(''); alert('Area created!'); };
  const createRateCard = async () => { await API.post('/admin/rate-cards', rateCard); alert('Rate card created!'); };
  const assignAgent = async () => { await API.post(`/admin/orders/${selectedOrder}/assign-agent`, { agent_id: agentId }); fetchOrders(); alert('Agent assigned!'); };
  const updateStatus = async (orderId, status) => { await API.put(`/admin/orders/${orderId}/status`, { status }); fetchOrders(); };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
  const btnStyle = { padding: '8px 15px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' };
  const cardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' };

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Admin Dashboard</h2>
        <div style={cardStyle}>
          <h3>Create Zone</h3>
          <input placeholder="Zone Name" style={inputStyle} value={zoneName} onChange={e => setZoneName(e.target.value)} />
          <button style={btnStyle} onClick={createZone}>Create Zone</button>
        </div>
        <div style={cardStyle}>
          <h3>Create Area</h3>
          <input placeholder="Area Name" style={inputStyle} value={areaName} onChange={e => setAreaName(e.target.value)} />
          <select style={inputStyle} onChange={e => setAreaZone(e.target.value)}>
            <option value="">Select Zone</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
          <button style={btnStyle} onClick={createArea}>Create Area</button>
        </div>
        <div style={cardStyle}>
          <h3>Create Rate Card</h3>
          <select style={inputStyle} onChange={e => setRateCard({ ...rateCard, zone_from: e.target.value })}>
            <option value="">Zone From</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
          <select style={inputStyle} onChange={e => setRateCard({ ...rateCard, zone_to: e.target.value })}>
            <option value="">Zone To</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
          <select style={inputStyle} onChange={e => setRateCard({ ...rateCard, order_type: e.target.value })}>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
          <input placeholder="Rate per KG" style={inputStyle} onChange={e => setRateCard({ ...rateCard, rate_per_kg: e.target.value })} />
          <input placeholder="COD Surcharge" style={inputStyle} onChange={e => setRateCard({ ...rateCard, cod_surcharge: e.target.value })} />
          <button style={btnStyle} onClick={createRateCard}>Create Rate Card</button>
        </div>
        <div style={cardStyle}>
          <h3>Assign Agent to Order</h3>
          <input placeholder="Order ID" style={inputStyle} onChange={e => setSelectedOrder(e.target.value)} />
          <input placeholder="Agent ID" style={inputStyle} onChange={e => setAgentId(e.target.value)} />
          <button style={btnStyle} onClick={assignAgent}>Assign Agent</button>
        </div>
        <div style={cardStyle}>
          <h3>All Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Payment</th>
                <th style={{ padding: '10px' }}>Charge</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{o.id}</td>
                  <td style={{ padding: '10px' }}>{o.order_type}</td>
                  <td style={{ padding: '10px' }}>{o.payment_type}</td>
                  <td style={{ padding: '10px' }}>₹{o.charge}</td>
                  <td style={{ padding: '10px' }}>{o.status}</td>
                  <td style={{ padding: '10px' }}>
                    <select onChange={e => updateStatus(o.id, e.target.value)} defaultValue="">
                      <option value="" disabled>Change Status</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
