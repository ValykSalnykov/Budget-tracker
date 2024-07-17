/**
 * @fileoverview Обработчик для получения информации о доходах.
 * @module GetIncome
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения информации о доходах из базы данных.
 * Он принимает GET запросы с идентификатором недели и возвращает список доходов
 * для указанной недели.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  const { weekId } = event.queryStringParameters;
  
  if (!weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Week ID is required' }),
    };
  }

  try {
    const incomes = await executeQuery(
      'SELECT IncomeId, Amount FROM Income WHERE Week = ?',
      [weekId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(incomes),
    };
  } catch (error) {
    console.error('Error fetching income data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch income data' }),
    };
  }
};