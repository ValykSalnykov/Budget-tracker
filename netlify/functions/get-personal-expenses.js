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
    const personalExpenses = await executeQuery(
      'SELECT PersonalExpensesId, Description, Amount FROM Personal_expenses WHERE Week = ?',
      [weekId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(personalExpenses),
    };
  } catch (error) {
    console.error('Error fetching personal expenses data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch personal expenses data' }),
    };
  }
};