const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id, description, amount } = JSON.parse(event.body);

  if (!id || !description || !amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'ID, Description, and Amount are required' }),
    };
  }

  try {
    await executeQuery(
      'UPDATE Personal_expenses SET Description = ?, Amount = ? WHERE PersonalExpensesId = ?',
      [description, amount, id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, description, amount }),
    };
  } catch (error) {
    console.error('Error updating personal expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update personal expense' }),
    };
  }
};