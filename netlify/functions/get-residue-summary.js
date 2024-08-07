/**
 * @fileoverview Обработчик для получения сводки остатка.
 * @module GetResidueSummary
 * @requires ./db-utils
 * 
 * @description
 * Этот модуль содержит AWS Lambda обработчик для получения сводки остатка за месяц.
 * Он принимает GET запросы с идентификатором месяца и возвращает информацию о месячном остатке
 * и ежедневном лимите расходов из представления monthly_residue_view.
 */

const { executeQuery } = require('./db-utils');

exports.handler = async function(event, context) {
  const { monthId } = event.queryStringParameters;

  if (!monthId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Month ID is required' })
    };
  }

  try {
    const query = `
      SELECT MonthId, MonthlyResidue, DailySpendingLimit
      FROM monthly_residue_view
      WHERE MonthId = ?
    `;
    const rows = await executeQuery(query, [monthId]);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found for the given month' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(rows[0])
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch residue summary' })
    };
  }
};