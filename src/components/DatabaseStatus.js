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
 *
 * @example
 * import DatabaseStatus from './components/DatabaseStatus';
 *
 * function App() {
 *   return (
 *     <div>
 *       <DatabaseStatus />
 *       { Остальные компоненты }
 *     </div>
 *   );
 * }
 */

import React, { useState, useEffect } from 'react';
import '../styles/DatabaseStatus.css';

/**
 * Компонент статуса базы данных.
 * @function DatabaseStatus
 * @returns {React.ReactElement} Отрендеренный компонент DatabaseStatus
 */
const DatabaseStatus = () => {
  /**
   * Статус соединения с базой данных.
   * @type {string}
   */
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    /**
     * Проверяет соединение с базой данных.
     * @async
     * @function checkConnection
     */
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
    /**
     * Интервал для периодической проверки соединения (в миллисекундах).
     * @type {number}
     */
    const intervalId = setInterval(checkConnection, 60000);

    /**
     * Очистка интервала при размонтировании компонента.
     * @returns {void}
     */
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`database-status ${connectionStatus}`}>
      <div className="status-indicator"></div>
    </div>
  );
};

export default DatabaseStatus;