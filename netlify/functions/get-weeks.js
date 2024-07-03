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
    const { monthId } = event.queryStringParameters;
    if (!monthId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Month ID is required' })
      };
    }

    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT WeeksId, `Week number` as weekNumber, `First week day` as firstWeekDay, `Last week day` as lastWeekDay FROM Weeks WHERE `Selected Month` = ? ORDER BY `Week number`', [monthId]);
    
    console.log('Fetched weeks:', rows);

    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weeks', details: error.message })
    };
  } finally {
    if (connection) await connection.end();
  }
};