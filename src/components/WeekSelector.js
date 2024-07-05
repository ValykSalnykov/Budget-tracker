import React, { useMemo } from 'react';
import '../styles/WeekSelector.css';

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

  if (isLoading) {
    return <div className="loading" aria-live="polite"></div>;
  }

  if (weeks.length === 0) {
    return <div className="no-weeks" aria-live="polite"></div>;
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