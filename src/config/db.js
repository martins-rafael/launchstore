const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  password: 'senha',
  host: 'localhost',
  port: 5432,
  database: 'launchstore'
});
