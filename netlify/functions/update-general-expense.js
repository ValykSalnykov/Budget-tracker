const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let { id, description, amount, weekId } = JSON.parse(event.body);

  // Проверка и преобразование типов данных
  id = parseInt(id);
  amount = parseFloat(amount);
  weekId = parseInt(weekId);

  if (!id || !description || isNaN(amount) || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Invalid input data',
        details: {
          id: id ? 'valid' : 'missing or invalid',
          description: description ? 'valid' : 'missing',
          amount: isNaN(amount) ? 'invalid' : 'valid',
          weekId: weekId ? 'valid' : 'missing or invalid'
        }
      }),
    };
  }

  try {
    // Вызываем хранимую процедуру для обновления общих расходов
    await executeQuery(
      'CALL UpdateGeneralExpense(?, ?, ?, ?)',
      [id, weekId, amount, description]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id, description, amount, weekId }),
    };
  } catch (error) {
    console.error('Error updating general expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update general expense', details: error.message }),
    };
  }
};