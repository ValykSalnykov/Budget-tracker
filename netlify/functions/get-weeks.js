/**
 * @fileoverview Обработчик для получения списка недель.
 * @module GetWeeks
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения списка недель для конкретного месяца.
 * Он принимает GET запросы с идентификатором месяца и возвращает отсортированный список недель
 * с их идентификаторами, номерами и датами начала и конца недели.
 */

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