/**
 * @fileoverview Обработчик для получения личных расходов.
 * @module GetPersonalExpenses
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения списка личных расходов из базы данных.
 * Он принимает GET запросы с идентификатором недели и возвращает список личных расходов
 * для указанной недели, включая описание и сумму каждого расхода.
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
    const personalExpenses = await executeQuery(
      'SELECT PersonalExpensesId, Description, Amount FROM Personal_expenses WHERE Week = ?',
      [weekId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(personalExpenses),
    };
  } catch (error) {
    console.error('Error fetching personal expenses data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch personal expenses data' }),
    };
  }
};