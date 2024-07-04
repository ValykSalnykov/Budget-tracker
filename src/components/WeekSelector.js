import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const WeekSelector = ({ weeks, selectedWeek, onSelectWeek, isLoading }) => {
  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (weeks.length === 0) {
    return <div className="no-weeks"></div>;
  }

  return (
    <div className="week-selector">
      {weeks.map((week, index) => (
        <button
          key={week.WeeksId}
          className={`week-button ${selectedWeek === index ? 'selected' : ''}`}
          onClick={() => onSelectWeek(index)}
        >
          <span className="week-number">Неделя {week.weekNumber}</span>
          <span className="week-dates">
            с {formatDate(week.firstWeekDay)} по {formatDate(week.lastWeekDay)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default WeekSelector;