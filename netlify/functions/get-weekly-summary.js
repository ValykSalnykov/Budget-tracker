/**
 * @fileoverview Обработчик для получения недельной сводки.
 * @module GetWeeklySummary
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения финансовой сводки за неделю.
 * Он принимает GET запросы с идентификатором недели и возвращает суммарную информацию
 * о доходах, общих расходах и личных расходах за указанную неделю из таблицы Accounting.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  const { weekId } = event.queryStringParameters;

  if (!weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Week ID is required' })
    };
  }

  try {
    const query = 'SELECT IncomeSum, GeneralExpensesSum, PersonalExpensesSum FROM Accounting WHERE Week = ?';
    const rows = await executeQuery(query, [weekId]);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found for the given week' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(rows[0])
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weekly summary' })
    };
  }
};