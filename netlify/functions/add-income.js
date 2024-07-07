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
      'INSERT INTO Income (Amount, Week) VALUES (?, ?)',
      [amount, weekId]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ id: result.insertId, amount, weekId }),
    };
  } catch (error) {
    console.error('Error adding income:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add income' }),
    };
  }
};