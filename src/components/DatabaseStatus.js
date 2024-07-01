import React, { useState, useEffect } from 'react';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/db-status');
        const data = await response.json();
        setIsConnected(data.status === 'connected');
        setError(null);
      } catch (error) {
        console.error('Ошибка при проверке статуса базы данных:', error);
        setIsConnected(false);
        setError('Не удалось проверить статус базы данных');
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{
      backgroundColor: isConnected ? '#4CAF50' : '#F44336',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      Статус базы данных: {isConnected ? 'Подключено' : 'Отключено'}
      {error && <div style={{ fontSize: '0.8em', marginTop: '5px' }}>{error}</div>}
    </div>
  );
};

export default DatabaseStatus;