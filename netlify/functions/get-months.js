const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

exports.handler = async function(event, context) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT MonthId, Name, `Month Number` as monthNumber FROM months ORDER BY `Month Number`');
      return {
        statusCode: 200,
        body: JSON.stringify(rows)
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch months' })
      };
    } finally {
      if (connection) await connection.end();
    }
  };