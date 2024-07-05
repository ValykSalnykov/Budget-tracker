const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  try {
    const rows = await executeQuery('SELECT MonthId, Name, `Month Number` as monthNumber FROM Months ORDER BY `Month Number`');
    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch months' })
    };
  }
};