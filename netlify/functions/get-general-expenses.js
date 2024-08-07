/**
 * @fileoverview Обработчик для получения общих расходов.
 * @module GetGeneralExpenses
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения списка общих расходов из базы данных.
 * Он принимает GET запросы с идентификатором недели и возвращает список общих расходов
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
    const generalExpenses = await executeQuery(
      'SELECT GeneralExpensesId, Description, Amount FROM General_expenses WHERE Week = ?',
      [weekId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(generalExpenses),
    };
  } catch (error) {
    console.error('Error fetching general expenses data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch general expenses data' }),
    };
  }
};