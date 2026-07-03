const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { sendStatusEmail } = require('../utils/mailer');

// Update Order Status
router.put('/orders/:id/status', auth(['agent']), async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status=$1 WHERE id=$2', [status, req.params.id]);
    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [req.params.id, status, req.user.id]
    );

    // Get customer email
    const order = await db.query(
      'SELECT u.email, o.id FROM orders o JOIN users u ON o.customer_id=u.id WHERE o.id=$1',
      [req.params.id]
    );
    const { email, id } = order.rows[0];
    await sendStatusEmail(email, id, status);

    // If delivered → mark agent available
    if (status === 'Delivered') {
      await db.query(
        'UPDATE agents SET is_available=true WHERE id=(SELECT agent_id FROM orders WHERE id=$1)',
        [req.params.id]
      );
    }

    // If failed → mark agent available + notify customer
    if (status === 'Failed') {
      await db.query(
        'UPDATE agents SET is_available=true WHERE id=(SELECT agent_id FROM orders WHERE id=$1)',
        [req.params.id]
      );
    }

    res.json({ message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Agent Location
router.put('/location', auth(['agent']), async (req, res) => {
  const { lat, lng } = req.body;
  try {
    await db.query(
      'UPDATE agents SET lat=$1, lng=$2 WHERE user_id=$3',
      [lat, lng, req.user.id]
    );
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Agent Orders
router.get('/orders', auth(['agent']), async (req, res) => {
  try {
    const agent = await db.query('SELECT id FROM agents WHERE user_id=$1', [req.user.id]);
    const orders = await db.query(
      'SELECT * FROM orders WHERE agent_id=$1 ORDER BY created_at DESC',
      [agent.rows[0].id]
    );
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;