/**
 * @fileoverview Обработчик для добавления дохода.
 * @module AddIncome
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для добавления дохода в базу данных.
 * Он принимает POST запросы с данными о доходе и сохраняет их, используя хранимую процедуру.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount, weekId } = JSON.parse(event.body);

  if (!amount || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Amount and Week ID are required' }),
    };
  }

  try {
    const result = await executeQuery(
      'CALL InsertIncome(?, ?)',
      [weekId, amount]
    );

    if (result && result.affectedRows > 0) {
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, amount, weekId }),
      };
    } else {
      throw new Error('Failed to insert income');
    }
  } catch (error) {
    console.error('Error adding income:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add income' }),
    };
  }
};