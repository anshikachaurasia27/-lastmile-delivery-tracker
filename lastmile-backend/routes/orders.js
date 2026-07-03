const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { calculateCharge } = require('../utils/rateCalculator');
const { sendStatusEmail } = require('../utils/mailer');

// Calculate Charge Preview
router.post('/calculate-charge', auth(['customer', 'admin']), async (req, res) => {
  const { pickup_area, drop_area, L, B, H, actual_weight, order_type, payment_type } = req.body;
  try {
    const pickupArea = await db.query('SELECT zone_id FROM areas WHERE id=$1', [pickup_area]);
    const dropArea = await db.query('SELECT zone_id FROM areas WHERE id=$1', [drop_area]);
    const pickupZone = pickupArea.rows[0].zone_id;
    const dropZone = dropArea.rows[0].zone_id;

    const rateCards = await db.query('SELECT * FROM rate_cards');
    const result = calculateCharge({
      L, B, H, actualWeight: actual_weight,
      orderType: order_type, paymentType: payment_type,
      pickupZone, dropZone,
      rateCards: rateCards.rows
    });
    res.json({ ...result, pickupZone, dropZone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Order
router.post('/create', auth(['customer', 'admin']), async (req, res) => {
  const { pickup_area, drop_area, L, B, H, actual_weight, order_type, payment_type, scheduled_date } = req.body;
  try {
    const pickupArea = await db.query('SELECT zone_id FROM areas WHERE id=$1', [pickup_area]);
    const dropArea = await db.query('SELECT zone_id FROM areas WHERE id=$1', [drop_area]);
    const pickupZone = pickupArea.rows[0].zone_id;
    const dropZone = dropArea.rows[0].zone_id;

    const rateCards = await db.query('SELECT * FROM rate_cards');
    const { volumetricWeight, billedWeight, charge } = calculateCharge({
      L, B, H, actualWeight: actual_weight,
      orderType: order_type, paymentType: payment_type,
      pickupZone, dropZone,
      rateCards: rateCards.rows
    });

    const result = await db.query(
      `INSERT INTO orders 
        (customer_id, pickup_area, drop_area, pickup_zone, drop_zone,
         length, breadth, height, actual_weight, volumetric_weight,
         billed_weight, order_type, payment_type, charge, status, scheduled_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'Created',$15)
       RETURNING *`,
      [req.user.id, pickup_area, drop_area, pickupZone, dropZone,
       L, B, H, actual_weight, volumetricWeight,
       billedWeight, order_type, payment_type, charge, scheduled_date]
    );

    const order = result.rows[0];

    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [order.id, 'Created', req.user.id]
    );

    // Send email
    // const user = await db.query('SELECT email FROM users WHERE id=$1', [req.user.id]);
    // await sendStatusEmail(user.rows[0].email, order.id, 'Created');

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Tracking Timeline
router.get('/:id/tracking', auth(['customer', 'admin', 'agent']), async (req, res) => {
  try {
    const order = await db.query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
    const logs = await db.query(
      'SELECT * FROM tracking_logs WHERE order_id=$1 ORDER BY timestamp ASC',
      [req.params.id]
    );
    res.json({ order: order.rows[0], timeline: logs.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reschedule Failed Order
router.post('/:id/reschedule', auth(['customer']), async (req, res) => {
  const { new_date } = req.body;
  try {
    await db.query(
      'UPDATE orders SET scheduled_date=$1, status=$2 WHERE id=$3',
      [new_date, 'Rescheduled', req.params.id]
    );
    await db.query(
      'INSERT INTO tracking_logs (order_id, status, changed_by) VALUES ($1,$2,$3)',
      [req.params.id, 'Rescheduled', req.user.id]
    );
    res.json({ message: 'Order rescheduled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get My Orders (Customer)
router.get('/my-orders', auth(['customer']), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE customer_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
} catch (err) {
  console.log('ORDER CREATE ERROR:', err.message, err.stack);
  res.status(500).json({ message: err.message });
}
});

// Get All Areas
router.get('/areas', auth(['customer', 'admin', 'agent']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM areas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;