/**
 * @fileoverview Обработчик для обновления общих расходов.
 * @module UpdateGeneralExpense
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для обновления записи об общих расходах в базе данных.
 * Он принимает PUT запросы с данными об обновляемом расходе, включая идентификатор, описание,
 * сумму и идентификатор недели. Модуль выполняет проверку входных данных и использует
 * хранимую процедуру для обновления информации в базе данных.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let { id, description, amount, weekId } = JSON.parse(event.body);

  // Проверка и преобразование типов данных
  id = parseInt(id);
  amount = parseFloat(amount);
  weekId = parseInt(weekId);

  if (!id || !description || isNaN(amount) || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Invalid input data',
        details: {
          id: id ? 'valid' : 'missing or invalid',
          description: description ? 'valid' : 'missing',
          amount: isNaN(amount) ? 'invalid' : 'valid',
          weekId: weekId ? 'valid' : 'missing or invalid'
        }
      }),
    };
  }

  try {
    // Вызываем хранимую процедуру для обновления общих расходов
    await executeQuery(
      'CALL UpdateGeneralExpense(?, ?, ?, ?)',
      [id, weekId, amount, description]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, description, amount, weekId }),
    };
  } catch (error) {
    console.error('Error updating general expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update general expense', details: error.message }),
    };
  }
};