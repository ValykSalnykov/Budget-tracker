import React, { useState, useEffect } from 'react';
import '../styles/DatabaseStatus.css';

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
    const intervalId = setInterval(checkConnection, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`database-status ${connectionStatus}`}>
      <div className="status-indicator"></div>
    </div>
  );
};

export default DatabaseStatus;