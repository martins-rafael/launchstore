const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'launchstore'
});