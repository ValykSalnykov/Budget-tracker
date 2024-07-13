const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'General Expense ID is required' }),
    };
  }

  try {
    // Вызываем хранимую процедуру для удаления общих расходов
    await executeQuery('CALL DeleteGeneralExpense(?)', [id]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error deleting general expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete general expense' }),
    };
  }
};