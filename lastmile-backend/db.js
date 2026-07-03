const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:SZxtyLBMMbNKeCNBMOtTjqDDawvExbmy@acela.proxy.rlwy.net:57062/railway',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;