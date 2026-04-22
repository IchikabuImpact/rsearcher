const mysql = require('mysql2/promise');

async function createDbConnection(config) {
  return mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  });
}

module.exports = { createDbConnection };
