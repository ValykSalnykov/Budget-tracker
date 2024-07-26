import { useState, useEffect } from 'react';

export const useDBStatus = () => {
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
    const intervalId = setInterval(checkConnection, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return connectionStatus;
};