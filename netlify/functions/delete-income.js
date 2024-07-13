const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Income ID is required' }),
    };
  }

  try {
    await executeQuery('CALL DeleteIncome(?)', [id]);

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (error) {
    console.error('Error deleting income:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete income' }),
    };
  }
};