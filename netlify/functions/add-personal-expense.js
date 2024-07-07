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
      'INSERT INTO Personal_expenses (Description, Amount, Week) VALUES (?, ?, ?)',
      [description, amount, weekId]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ id: result.insertId, description, amount, weekId }),
    };
  } catch (error) {
    console.error('Error adding personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add personal expense' }),
    };
  }
};