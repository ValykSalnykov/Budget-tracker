/**
 * @fileoverview Обработчик для обновления дохода.
 * @module UpdateIncome
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для обновления записи о доходе в базе данных.
 * Он принимает PUT запросы с данными об обновляемом доходе, включая идентификатор,
 * сумму и идентификатор недели. Модуль проверяет наличие всех необходимых данных
 * и использует хранимую процедуру для обновления информации в базе данных.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, amount, weekId } = JSON.parse(event.body);

  if (!id || !amount || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'ID, Amount, and Week ID are required' }),
    };
  }

  try {
    await executeQuery(
      'CALL UpdateIncome(?, ?, ?)',
      [id, weekId, amount]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, amount, weekId }),
    };
  } catch (error) {
    console.error('Error updating income:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update income' }),
    };
  }
};