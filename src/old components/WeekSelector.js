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
 */

import React, { useMemo, useEffect } from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const WeekSelector = React.memo(({ weeks, selectedWeek, onSelectWeek, isLoading }) => {
  const formattedWeeks = useMemo(() => 
    weeks.map(week => ({
      ...week,
      formattedFirstDay: formatDate(week.firstWeekDay),
      formattedLastDay: formatDate(week.lastWeekDay)
    })),
    [weeks]
  );

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
    return <div className="text-center py-4 text-gray-600" aria-live="polite">Загрузка...</div>;
  }

  if (weeks.length === 0) {
    return <div className="text-center py-4 text-gray-600" aria-live="polite">Нет доступных недель</div>;
  }

  return (
    <div className="flex flex-wrap justify-between items-center mt-5" role="radiogroup" aria-label="Week selection">
      {formattedWeeks.map((week, index) => (
        <button
          key={week.WeeksId}
          className={`flex flex-col items-center p-4 m-2 border-2 rounded-lg transition-all duration-300 ease-in-out
            ${selectedWeek === index 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-800 border-blue-500 hover:shadow-lg hover:-translate-y-1'
            }
            min-w-[180px] cursor-pointer`}
          onClick={() => onSelectWeek(index)}
          role="radio"
          aria-checked={selectedWeek === index}
        >
          <span className="font-bold mb-1">Неделя {week.weekNumber}</span>
          <span className={`text-sm ${selectedWeek === index ? 'text-blue-100' : 'text-gray-600'}`}>
            с {week.formattedFirstDay} по {week.formattedLastDay}
          </span>
        </button>
      ))}
    </div>
  );
});

export default WeekSelector;