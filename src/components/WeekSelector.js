import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.getDate();
};

const WeekSelector = ({ weeks, selectedWeek, onSelectWeek }) => {
  console.log('Weeks in WeekSelector:', weeks);

  if (weeks.length === 0) {
    return <div>Нет доступных недель</div>;
  }

  return (
    <div className="week-selector">
      {weeks.map((week, index) => (
        <button
          key={week.WeeksId}  // Изменено с WeekId на WeeksId
          className={`week-button ${selectedWeek === index ? 'selected' : ''}`}
          onClick={() => onSelectWeek(index)}
        >
          {week.weekNumber}
          <span className="week-dates">
            {formatDate(week.firstWeekDay)} по {formatDate(week.lastWeekDay)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default WeekSelector;