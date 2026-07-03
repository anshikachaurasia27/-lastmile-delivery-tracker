// LastMile Delivery Tracker
// Developed by: Anshika Chaurasia
// Email: anshikachaurasia99@gmail.com
// © 2026 All Rights Reserved

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/orders', require('./routes/orders'));
app.use('/agent', require('./routes/agent'));

app.get('/', (req, res) => res.send('LastMile API Running'));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server started on port 5000');
});