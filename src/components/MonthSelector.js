import React from 'react';

const months = [
  'Август', 'Сентябрь', 'Октябрь', 'Ноябрь',
  'Декабрь', 'Январь', 'Февраль', 'Март',
  'Апрель', 'Май', 'Июнь', 'Июль'
];

const MonthSelector = ({ selectedMonth, onSelectMonth }) => {
  return (
    <div className="month-selector">
      {months.map(month => (
        <button
          key={month}
          className={`month-button ${selectedMonth === month ? 'selected' : ''}`}
          onClick={() => onSelectMonth(month)}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthSelector;