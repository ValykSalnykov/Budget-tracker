/**
 * @fileoverview Главный компонент приложения, управляющий выбором месяца и недели.
 * @module App
 * @requires react
 * @requires ./components/MonthCarousel
 * @requires ./components/WeekSelector
 * @requires ./components/DatabaseStatus
 * @requires ./components/BudgetList
 * @requires ./App.css
 * 
 * @description
 * Этот файл содержит главный компонент приложения, который управляет
 * выбором месяца и недели. Он использует хуки React для управления состоянием
 * и побочными эффектами, а также включает в себя логику для загрузки данных
 * о месяцах и неделях с сервера.
 * 
 * @example
 * import App from './App';
 * 
 * ReactDOM.render(<App />, document.getElementById('root'));
 */

import React, { useState, useEffect, useCallback } from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import BudgetList from './components/BudgetList';
import './App.css';

/**
 * Главный компонент приложения.
 * @function App
 * @returns {React.ReactElement} Отрендеренный компонент App
 */
const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isLoading, setIsLoading] = useState({ months: true, weeks: false });
  const [, setError] = useState(null);

  /**
   * Получает данные с заданного URL.
   * @async
   * @function fetchData
   * @param {string} url - URL для получения данных
   * @param {string} errorMessage - Сообщение об ошибке, если запрос не удался
   * @returns {Promise<Object>} Полученные данные
   * @throws {Error} Выбрасывает ошибку, если запрос не удался
   */
  const fetchData = useCallback(async (url, errorMessage) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  }, []);

  /**
   * Получает данные о месяцах и устанавливает начальный выбранный месяц.
   * @async
   * @function fetchMonths
   */
  const fetchMonths = useCallback(async () => {
    try {
      const data = await fetchData('/.netlify/functions/get-months', 'Не удалось получить данные о месяцах');
      setMonths(data);
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthData = data.find(month => month.monthNumber === currentMonth) || data[0];
      setSelectedMonth(currentMonthData?.MonthId);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, months: false }));
    }
  }, [fetchData]);

  /**
   * Получает данные о неделях для заданного месяца.
   * @async
   * @function fetchWeeks
   * @param {string} monthId - ID месяца, для которого нужно получить недели
   */
  const fetchWeeks = useCallback(async (monthId) => {
    if (!monthId) return;
    setIsLoading(prev => ({ ...prev, weeks: true }));
    try {
      const response = await fetch(`/.netlify/functions/get-weeks?monthId=${monthId}`);
      if (!response.ok) {
        throw new Error('Не удалось получить данные о неделях');
      }
      const data = await response.json();
      setWeeks(data);
      setSelectedWeek(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, weeks: false }));
    }
  }, []);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  useEffect(() => {
    if (selectedMonth) {
      fetchWeeks(selectedMonth);
    }
  }, [selectedMonth, fetchWeeks]);

  /**
   * Обрабатывает выбор месяца.
   * @function handleMonthSelect
   * @param {string} monthId - ID выбранного месяца
   */
  const handleMonthSelect = useCallback((monthId) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);
  }, []);

  /**
   * Обрабатывает выбор недели.
   * @function handleWeekSelect
   * @param {number} weekIndex - Индекс выбранной недели
   */
  const handleWeekSelect = useCallback((weekIndex) => {
    setSelectedWeek(weekIndex);
  }, []);

  return (
    <div className="app">
      <DatabaseStatus/>
      {months.length > 0 && (
        <MonthCarousel
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={handleMonthSelect}
        />
      )}
      <WeekSelector
        weeks={weeks}
        selectedWeek={selectedWeek}
        onSelectWeek={handleWeekSelect}
        isLoading={isLoading.weeks}
      />
      {weeks.length > 0 && selectedWeek !== null && (
        <BudgetList selectedWeek={selectedWeek} weeks={weeks} selectedMonth={selectedMonth}/>
      )}
    </div>
  );
}

export default App;