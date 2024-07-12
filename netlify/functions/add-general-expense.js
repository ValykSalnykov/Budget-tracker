const { executeQuery } = require('./db-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { description, amount, weekId } = JSON.parse(event.body);

  if (!description || !amount || !weekId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Description, Amount, and Week ID are required' }),
    };
  }

  try {
    // Вызываем хранимую процедуру
    const result = await executeQuery(
      'CALL InsertGeneralExpense(?, ?, ?)',
      [weekId, amount, description]
    );

    // Проверяем, что результат существует и содержит нужную информацию
    if (result && result.affectedRows > 0) {
      // Если процедура не возвращает ID, можно использовать affectedRows для подтверждения вставки
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, description, amount, weekId }),
      };
    } else {
      throw new Error('Failed to insert general expense');
    }
  } catch (error) {
    console.error('Error adding general expense:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add general expense' }),
    };
  }
};

// const { executeQuery } = require('./db-utils');

// exports.handler = async (event) => {
//   if (event.httpMethod !== 'POST') {
//     return { statusCode: 405, body: 'Method Not Allowed' };
//   }

//   const { description, amount, weekId } = JSON.parse(event.body);

//   if (!description || !amount || !weekId) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ error: 'Description, Amount, and Week ID are required' }),
//     };
//   }

//   try {
//     const result = await executeQuery(
//       'INSERT INTO General_expenses (Description, Amount, Week) VALUES (?, ?, ?)',
//       [description, amount, weekId]
//     );

//     return {
//       statusCode: 201,
//       body: JSON.stringify({ id: result.insertId, description, amount, weekId }),
//     };
//   } catch (error) {
//     console.error('Error adding general expense:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Failed to add general expense' }),
//     };
//   }
// };