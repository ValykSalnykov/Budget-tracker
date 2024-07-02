const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

exports.handler = async function(event, context) {
  console.log('DB Config:', { ...dbConfig, password: '******' });
  let connection;
  try {
    console.log('Attempting to connect to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connection created, pinging...');
    await connection.ping();
    console.log('Ping successful');
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'connected' })
    };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'disconnected', error: error.message, config: { ...dbConfig, password: '******' } })
    };
  } finally {
    if (connection) {
      console.log('Closing connection');
      await connection.end();
    }
  }
};