import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'sql7.freemysqlhosting.net',
  port: 3306,
  user: 'sql7716884',
  password: 'VvVv4815162342!',
  database: 'sql7716884' // You might need to specify the database name
};

let connection = null;

export const connectToDatabase = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to the database.');
    return true;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return false;
  }
};

export const closeConnection = async () => {
  if (connection) {
    await connection.end();
    console.log('Database connection closed.');
  }
};

export const getConnection = () => connection;