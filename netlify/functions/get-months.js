/**
 * @fileoverview Обработчик для получения списка месяцев.
 * @module GetMonths
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения списка всех месяцев из базы данных.
 * Он выполняет запрос к таблице Months и возвращает отсортированный список месяцев с их идентификаторами и номерами.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  try {
    const rows = await executeQuery('SELECT MonthId, Name, `Month Number` as monthNumber FROM Months ORDER BY `Month Number`');
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
  }
};