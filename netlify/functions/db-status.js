const mysql = require('mysql2/promise');

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
    await connection.ping();
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'connected' })
    };
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'disconnected', error: error.message })
    };
  } finally {
    if (connection) await connection.end();
  }
};