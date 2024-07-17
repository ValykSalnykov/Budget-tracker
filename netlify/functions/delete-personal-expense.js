/**
 * @fileoverview Обработчик для удаления личных расходов.
 * @module DeletePersonalExpense
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для удаления личных расходов из базы данных.
 * Он принимает DELETE запросы с идентификатором расхода и удаляет соответствующую запись,
 * используя хранимую процедуру.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Personal Expense ID is required' }),
    };
  }

  try {
    await executeQuery('CALL DeletePersonalExpense(?)', [id]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error deleting personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete personal expense' }),
    };
  }
};