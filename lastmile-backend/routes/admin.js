const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Create Zone
router.post('/zones', auth(['admin']), async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query('INSERT INTO zones (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Area
router.post('/areas', auth(['admin']), async (req, res) => {
  const { name, zone_id } = req.body;
  try {
    const result = await db.query('INSERT INTO areas (name, zone_id) VALUES ($1, $2) RETURNING *', [name, zone_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Rate Card
router.post('/rate-cards', auth(['admin']), async (req, res) => {
  const { zone_from, zone_to, order_type, rate_per_kg, cod_surcharge } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO rate_cards (zone_from, zone_to, order_type, rate_per_kg, cod_surcharge) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [zone_from, zone_to, order_type, rate_per_kg, cod_surcharge]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Orders
router.get('/orders', auth(['admin']), async (req, res) => {
  const { status, zone, agent_id } = req.query;
  try {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status) { params.push(status); query += ` AND status=$${params.length}`; }
    if (agent_id) { params.push(agent_id); query += ` AND agent_id=$${params.length}`; }
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Override Order Status
router.put('/orders/:id/status', auth(['admin']), async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status=$1 WHERE id=$2', [status, req.params.id]);
    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [req.params.id, status, req.user.id]
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manual Agent Assignment
router.post('/orders/:id/assign-agent', auth(['admin']), async (req, res) => {
  const { agent_id } = req.body;
  try {
    await db.query('UPDATE orders SET agent_id=$1, status=$2 WHERE id=$3', [agent_id, 'Assigned', req.params.id]);
    await db.query('UPDATE agents SET is_available=false WHERE id=$1', [agent_id]);
    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [req.params.id, 'Assigned', req.user.id]
    );
    res.json({ message: 'Agent assigned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auto Assignment
router.post('/orders/:id/auto-assign', auth(['admin']), async (req, res) => {
  try {
    const order = await db.query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
    const o = order.rows[0];
    const agents = await db.query('SELECT * FROM agents WHERE zone_id=$1 AND is_available=true', [o.pickup_zone]);
    const { findNearestAgent } = require('../utils/autoAssign');
    const agent = findNearestAgent(agents.rows, o.pickup_lat, o.pickup_lng);
    if (!agent) return res.status(404).json({ message: 'No available agent' });
    await db.query('UPDATE orders SET agent_id=$1, status=$2 WHERE id=$3', [agent.id, 'Assigned', req.params.id]);
    await db.query('UPDATE agents SET is_available=false WHERE id=$1', [agent.id]);
    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [req.params.id, 'Assigned', req.user.id]
    );
    res.json({ message: 'Agent auto-assigned', agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Zones
router.get('/zones', auth(['admin']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM zones');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;