const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Personal Expense ID is required' }),
    };
  }

  try {
    await executeQuery(
      'DELETE FROM Personal_expenses WHERE PersonalExpensesId = ?',
      [id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error deleting personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete personal expense' }),
    };
  }
};