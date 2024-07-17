/**
 * @fileoverview Утилиты для работы с базой данных.
 * @module DbUtils
 * @requires mysql2/promise
 * @requires dotenv
 * 
 * @description
 * Этот модуль предоставляет функцию для выполнения запросов к базе данных MySQL.
 * Он использует конфигурацию из переменных окружения и управляет подключением к базе данных.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = { executeQuery };