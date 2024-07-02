const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'sql7.freemysqlhosting.net',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'sql7716884',
  password: process.env.DB_PASSWORD || 'VvVv4815162342!',
  database: process.env.DB_NAME || 'sql7716884'
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  try {
    const connection = await getConnection();

    switch (httpMethod) {
      case 'GET':
        const [rows] = await connection.execute('SELECT * FROM budget_items');
        await connection.end();
        return { statusCode: 200, body: JSON.stringify(rows) };

      case 'POST':
        const { name, amount, type, week_index } = JSON.parse(body);
        const [result] = await connection.execute(
          'INSERT INTO budget_items (name, amount, type, week_index) VALUES (?, ?, ?, ?)',
          [name, amount, type, week_index]
        );
        await connection.end();
        return { 
          statusCode: 201, 
          body: JSON.stringify({ id: result.insertId, name, amount, type, week_index }) 
        };

      // Добавьте case для PUT и DELETE, если необходимо

      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};