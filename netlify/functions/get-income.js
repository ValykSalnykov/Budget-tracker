const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  const { weekId } = event.queryStringParameters;
  
  if (!weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Week ID is required' }),
    };
  }

  try {
    const incomes = await executeQuery(
      'SELECT IncomeId, Amount FROM Income WHERE Week = ?',
      [weekId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(incomes),
    };
  } catch (error) {
    console.error('Error fetching income data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch income data' }),
    };
  }
};