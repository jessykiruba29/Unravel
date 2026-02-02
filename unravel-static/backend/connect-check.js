const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const url = process.env.DATABASE_URL;
  console.log('DATABASE_URL =', url);
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }, // Accept self-signed certs
  });
  try {
    console.log('Connecting...');
    await client.connect();
    const res = await client.query('select now() as now');
    console.log('✅ Connected. Server time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await client.end();
  }
})();
