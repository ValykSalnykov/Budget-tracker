/**
 * @fileoverview Компонент карусели для выбора месяца.
 * @module MonthCarousel
 * @requires react
 * @requires lucide-react
 * @requires ../styles/MonthCarousel.css
 *
 * @description
 * Этот компонент представляет собой карусель для выбора месяца.
 * Он отображает текущий выбранный месяц и позволяет пользователю
 * переключаться между месяцами с помощью кнопок "вперед" и "назад".
*/

import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/MonthCarousel.css';

const MonthCarousel = React.memo(({ months, selectedMonth, onSelectMonth }) => {

  const selectedIndex = useMemo(() => 
    months.findIndex(month => month.MonthId === selectedMonth),
    [months, selectedMonth]
  );

  const handlePrevMonth = useCallback(() => {
    if (selectedIndex > 0) {
      onSelectMonth(months[selectedIndex - 1].MonthId);
    }
  }, [selectedIndex, months, onSelectMonth]);

  const handleNextMonth = useCallback(() => {
    if (selectedIndex < months.length - 1) {
      onSelectMonth(months[selectedIndex + 1].MonthId);
    }
  }, [selectedIndex, months, onSelectMonth]);

  return (
    <div className="month-carousel" role="region" aria-label="Month selection">
      <button 
        className="month-nav-button" 
        onClick={handlePrevMonth} 
        disabled={selectedIndex === 0}
        aria-label="Previous month"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="month-display" aria-live="polite">
        {months[selectedIndex]?.Name || 'Выберите месяц'}
      </div>
      <button 
        className="month-nav-button" 
        onClick={handleNextMonth} 
        disabled={selectedIndex === months.length - 1}
        aria-label="Next month"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
});

export default MonthCarousel;