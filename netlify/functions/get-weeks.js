const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  try {
    const { monthId } = event.queryStringParameters;
    if (!monthId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Month ID is required' })
      };
    }

    const rows = await executeQuery(
      'SELECT WeeksId, `Week number` as weekNumber, `First week day` as firstWeekDay, `Last week day` as lastWeekDay FROM Weeks WHERE `Selected Month` = ? ORDER BY `Week number`',
      [monthId]
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weeks', details: error.message })
    };
  }
};