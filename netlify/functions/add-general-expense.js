/**
 * @fileoverview Обработчик для добавления общих расходов.
 * @module AddGeneralExpense
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для добавления общих расходов в базу данных.
 * Он принимает POST запросы с данными о расходах и сохраняет их, используя хранимую процедуру.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { description, amount, weekId } = JSON.parse(event.body);

  if (!description || !amount || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Description, Amount, and Week ID are required' }),
    };
  }

  try {
    const result = await executeQuery(
      'CALL InsertGeneralExpense(?, ?, ?)',
      [weekId, amount, description]
    );
    if (result && result.affectedRows > 0) {
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, description, amount, weekId }),
      };
    } else {
      throw new Error('Failed to insert general expense');
    }
  } catch (error) {
    console.error('Error adding general expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add general expense' }),
    };
  }
};