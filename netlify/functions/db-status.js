const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  try {
    await executeQuery('SELECT 1');
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'connected' })
    };
  } catch (error) {
    console.error('Error connecting to database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'disconnected', error: error.message })
    };
  }
};