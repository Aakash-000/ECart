const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecart',
  password: 'password',
  port: 5432, // Default PostgreSQL port
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL connected successfully.');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;