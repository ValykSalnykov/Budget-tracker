const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, amount } = JSON.parse(event.body);

  if (!id || !amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Income ID and Amount are required' }),
    };
  }

  try {
    await executeQuery(
      'UPDATE Income SET Amount = ? WHERE IncomeId = ?',
      [amount, id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, amount }),
    };
  } catch (error) {
    console.error('Error updating income:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update income' }),
    };
  }
};