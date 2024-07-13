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