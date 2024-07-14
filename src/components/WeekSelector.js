/**
 * @fileoverview Компонент выбора недели.
 * @module WeekSelector
 * @requires react
 * @requires ../styles/WeekSelector.css
 *
 * @description
 * Этот компонент отображает список недель для выбора.
 * Он позволяет пользователю выбрать неделю, отображая номер недели и диапазон дат.
 * Компонент также автоматически выбирает текущую неделю при первоначальной загрузке.
 *
 * @example
 * import WeekSelector from './components/WeekSelector';
 *
 * function App() {
 *   const [weeks, setWeeks] = useState([]);
 *   const [selectedWeek, setSelectedWeek] = useState(null);
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   return (
 *     <WeekSelector
 *       weeks={weeks}
 *       selectedWeek={selectedWeek}
 *       onSelectWeek={setSelectedWeek}
 *       isLoading={isLoading}
 *     />
 *   );
 * }
 */

import React, { useMemo, useEffect } from 'react';
import '../styles/WeekSelector.css';

/**
 * Форматирует дату в строку.
 * @function
 * @param {string} dateString - Строка с датой для форматирования
 * @returns {string} Отформатированная дата
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

/**
 * Компонент выбора недели.
 *
 * @function WeekSelector
 * @param {Object} props - Свойства компонента
 * @param {Array} props.weeks - Массив объектов недель
 * @param {number|null} props.selectedWeek - Индекс выбранной недели
 * @param {function} props.onSelectWeek - Функция обратного вызова для выбора недели
 * @param {boolean} props.isLoading - Флаг, указывающий на загрузку данных
 * @returns {React.ReactElement} Отрендеренный компонент WeekSelector
 */
const WeekSelector = React.memo(({ weeks, selectedWeek, onSelectWeek, isLoading }) => {
  /**
   * Форматированный список недель.
   * @type {Array}
   */
  const formattedWeeks = useMemo(() => 
    weeks.map(week => ({
      ...week,
      formattedFirstDay: formatDate(week.firstWeekDay),
      formattedLastDay: formatDate(week.lastWeekDay)
    })),
    [weeks]
  );

  /**
   * Эффект для автоматического выбора текущей недели при загрузке.
   */
  useEffect(() => {
    if (weeks.length > 0 && selectedWeek === null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentWeekIndex = weeks.findIndex(week => {
        const firstDay = new Date(week.firstWeekDay);
        const lastDay = new Date(week.lastWeekDay);
        firstDay.setHours(0, 0, 0, 0);
        lastDay.setHours(23, 59, 59, 999);
        return today >= firstDay && today <= lastDay;
      });
      if (currentWeekIndex !== -1) {
        onSelectWeek(currentWeekIndex);
      } else {
        onSelectWeek(weeks.length - 1);
      }
    }
  }, [weeks, selectedWeek, onSelectWeek]);

  if (isLoading) {
    return <div className="loading" aria-live="polite">Загрузка...</div>;
  }

  if (weeks.length === 0) {
    return <div className="no-weeks" aria-live="polite">Нет доступных недель</div>;
  }

  return (
    <div className="week-selector" role="radiogroup" aria-label="Week selection">
      {formattedWeeks.map((week, index) => (
        <button
          key={week.WeeksId}
          className={`week-button ${selectedWeek === index ? 'selected' : ''}`}
          onClick={() => onSelectWeek(index)}
          role="radio"
          aria-checked={selectedWeek === index}
        >
          <span className="week-number">Неделя {week.weekNumber}</span>
          <span className="week-dates">
            с {week.formattedFirstDay} по {week.formattedLastDay}
          </span>
        </button>
      ))}
    </div>
  );
});

export default WeekSelector;