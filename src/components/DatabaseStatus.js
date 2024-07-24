import React, { useState, useEffect } from 'react';
import { Wifi, WifiLow, WifiOff } from 'lucide-react';

const DatabaseStatusIcon = () => {
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

  const renderIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={24} className="text-green-500" />;
      case 'connecting':
        return <WifiLow size={24} className="text-yellow-400 animate-pulse" />;
      case 'disconnected':
        return <WifiOff size={24} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderIcon()}
    </div>
  );
};

export default DatabaseStatusIcon;