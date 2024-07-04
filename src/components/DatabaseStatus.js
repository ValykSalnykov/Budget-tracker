import React, { useState, useEffect } from 'react';
import './DatabaseStatus.css';

const DatabaseStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('connecting');
        const response = await fetch('/.netlify/functions/db-status');
        const data = await response.json();
        setConnectionStatus(data.status === 'connected' ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Ошибка при проверке статуса базы данных:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    // Проверяем статус каждые 30 секунд
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`database-status ${connectionStatus}`}>
      <div className="status-indicator"></div>
    </div>
  );
};

export default DatabaseStatus;

// // Импортируем необходимые библиотеки React
// import React, { useState, useEffect } from 'react';

// // Компонент для отображения статуса базы данных
// const DatabaseStatus = () => {
//   // Используем хуки useState для управления состоянием подключения и ошибками
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);

//   // Используем хук useEffect для проверки статуса подключения при загрузке компонента
//   useEffect(() => {
//     // Асинхронная функция для проверки подключения к базе данных
//     const checkConnection = async () => {
//       try {
//         // Отправляем запрос к функции Netlify для проверки статуса базы данных
//         const response = await fetch('/.netlify/functions/db-status');
//         const data = await response.json();
//         // Обновляем состояние в зависимости от полученного статуса
//         setIsConnected(data.status === 'connected');
//         setError(null);
//       } catch (error) {
//         // Обрабатываем ошибку при проверке статуса базы данных
//         console.error('Ошибка при проверке статуса базы данных:', error);
//         setIsConnected(false);
//         setError('Не удалось проверить статус базы данных');
//       }
//     };

//     // Вызываем функцию проверки подключения
//     checkConnection();
//   }, []); // Пустой массив зависимостей означает, что эффект выполняется только один раз при монтировании компонента

//   // Рендерим компонент
//   return (
//     <div style={{
//       backgroundColor: isConnected ? '#4CAF50' : '#F44336', // Изменяем цвет фона в зависимости от статуса подключения
//       color: 'white',
//       padding: '10px',
//       textAlign: 'center',
//       fontWeight: 'bold'
//     }}>
//       Статус базы данных: {isConnected ? 'Подключено' : 'Отключено'} {/* Отображаем статус подключения */}
//       {error && <div style={{ fontSize: '0.8em', marginTop: '5px' }}>{error}</div>} {/* Отображаем сообщение об ошибке, если оно есть */}
//     </div>
//   );
// };

// // Экспортируем компонент для использования в других частях приложения
// export default DatabaseStatus;
