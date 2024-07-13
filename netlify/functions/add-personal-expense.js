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
      'CALL InsertPersonalExpense(?, ?, ?)',
      [weekId, amount, description]
    );

    if (result && result.affectedRows > 0) {
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, description, amount, weekId }),
      };
    } else {
      throw new Error('Failed to insert personal expense');
    }
  } catch (error) {
    console.error('Error adding personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add personal expense' }),
    };
  }
};