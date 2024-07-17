/**
 * @fileoverview Обработчик для обновления личных расходов.
 * @module UpdatePersonalExpense
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для обновления записи о личных расходах в базе данных.
 * Он принимает PUT запросы с данными об обновляемом расходе, включая идентификатор, описание,
 * сумму и идентификатор недели. Модуль проверяет наличие всех необходимых данных
 * и использует хранимую процедуру для обновления информации в базе данных.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, description, amount, weekId } = JSON.parse(event.body);

  if (!id || !description || !amount || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'ID, Description, Amount, and Week ID are required' }),
    };
  }

  try {
    await executeQuery(
      'CALL UpdatePersonalExpense(?, ?, ?, ?)',
      [id, weekId, amount, description]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, description, amount, weekId }),
    };
  } catch (error) {
    console.error('Error updating personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update personal expense' }),
    };
  }
};