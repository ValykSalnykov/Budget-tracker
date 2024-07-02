// Импортируем необходимые библиотеки React
import React, { useState, useEffect } from 'react';

// Компонент для отображения статуса базы данных
const DatabaseStatus = () => {
  // Используем хуки useState для управления состоянием подключения и ошибками
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Используем хук useEffect для проверки статуса подключения при загрузке компонента
  useEffect(() => {
    // Асинхронная функция для проверки подключения к базе данных
    const checkConnection = async () => {
      try {
        // Отправляем запрос к функции Netlify для проверки статуса базы данных
        const response = await fetch('/.netlify/functions/db-status');
        const data = await response.json();
        // Обновляем состояние в зависимости от полученного статуса
        setIsConnected(data.status === 'connected');
        setError(null);
      } catch (error) {
        // Обрабатываем ошибку при проверке статуса базы данных
        console.error('Ошибка при проверке статуса базы данных:', error);
        setIsConnected(false);
        setError('Не удалось проверить статус базы данных');
      }
    };

    // Вызываем функцию проверки подключения
    checkConnection();
  }, []); // Пустой массив зависимостей означает, что эффект выполняется только один раз при монтировании компонента

  // Рендерим компонент
  return (
    <div style={{
      backgroundColor: isConnected ? '#4CAF50' : '#F44336', // Изменяем цвет фона в зависимости от статуса подключения
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      Статус базы данных: {isConnected ? 'Подключено' : 'Отключено'} {/* Отображаем статус подключения */}
      {error && <div style={{ fontSize: '0.8em', marginTop: '5px' }}>{error}</div>} {/* Отображаем сообщение об ошибке, если оно есть */}
    </div>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default DatabaseStatus;
