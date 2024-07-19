/**
 * @fileoverview Компонент для отображения статуса подключения к базе данных.
 * @module DatabaseStatus
 * @requires react
 * @requires ../styles/DatabaseStatus.css
 *
 * @description
 * Этот компонент отображает текущий статус подключения к базе данных.
 * Он периодически проверяет соединение и обновляет визуальный индикатор.
 * Статус может быть "подключение", "подключено" или "отключено".
**/

import React, { useState, useEffect } from 'react';

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

    const intervalId = setInterval(checkConnection, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const statusColors = {
    connected: 'bg-green-500',
    disconnected: 'bg-red-500',
    connecting: 'bg-yellow-400'
  };

  return (
    <div className="fixed top-0 left-0 w-full h-2 z-50">
      <div 
        className={`h-full w-full transition-colors duration-300 ease-in-out ${statusColors[connectionStatus]} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
      ></div>
    </div>
  );
};

export default DatabaseStatus;