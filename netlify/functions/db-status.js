/**
 * @fileoverview Обработчик для проверки статуса подключения к базе данных.
 * @module DbStatus
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для проверки статуса подключения к базе данных.
 * Он выполняет простой запрос к базе данных и возвращает статус подключения.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  try {
    await executeQuery('SELECT 1');
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'connected' })
    };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'disconnected', error: error.message })
    };
  }
};