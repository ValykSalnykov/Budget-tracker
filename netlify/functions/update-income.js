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