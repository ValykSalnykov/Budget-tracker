// Импортируем библиотеку mysql2 с поддержкой промисов
const mysql = require('mysql2/promise');

// Конфигурация базы данных, параметры берутся из переменных окружения
const dbConfig = {
  host: process.env.DB_HOST, // Хост базы данных
  port: process.env.DB_PORT, // Порт базы данных
  user: process.env.DB_USER, // Пользователь базы данных
  password: process.env.DB_PASSWORD, // Пароль пользователя базы данных
  database: process.env.DB_NAME // Имя базы данных
};

// Основная асинхронная функция-обработчик
exports.handler = async function(event, context) {
  // Логируем конфигурацию базы данных, скрывая пароль
  console.log('DB Config:', { ...dbConfig, password: '******' });
  
  let connection; // Переменная для хранения соединения с базой данных
  try {
    // Попытка установить соединение с базой данных
    console.log('Attempting to connect to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Проверяем соединение путем отправки пинга
    console.log('Connection created, pinging...');
    await connection.ping();
    console.log('Ping successful');
    
    // Возвращаем успешный ответ с кодом 200 и статусом "connected"
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'connected' })
    };
  } catch (error) {
    // Логируем ошибку в случае неудачи подключения
    console.error('Error connecting to database:', error);
    
    // Возвращаем ответ с кодом 500 и статусом "disconnected", включая сообщение об ошибке
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'disconnected', error: error.message, config: { ...dbConfig, password: '******' } })
    };
  } finally {
    // Закрываем соединение, если оно было установлено
    if (connection) {
      console.log('Closing connection');
      await connection.end();
    }
  }
};
