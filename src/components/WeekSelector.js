import React from 'react';

const WeekSelector = ({ weeks, selectedWeek, onSelectWeek }) => {
  return (
    <div className="week-selector">
      {weeks.map((week, index) => (
        <button
          key={index}
          className={`week-button ${selectedWeek === index ? 'selected' : ''}`}
          onClick={() => onSelectWeek(index)}
        >
          {index + 1}
          <span className="week-dates">{week.start} — {week.end}</span>
        </button>
      ))}
    </div>
  );
};

export default WeekSelector;