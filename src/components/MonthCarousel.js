import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MonthCarousel = ({ months, selectedMonth, onSelectMonth }) => {
  const selectedIndex = months.findIndex(month => month.MonthId === selectedMonth);

  const handlePrevMonth = () => {
    if (selectedIndex > 0) {
      onSelectMonth(months[selectedIndex - 1].MonthId);
    }
  };

  const handleNextMonth = () => {
    if (selectedIndex < months.length - 1) {
      onSelectMonth(months[selectedIndex + 1].MonthId);
    }
  };

  return (
    <div className="month-carousel">
      <button 
        className="month-nav-button" 
        onClick={handlePrevMonth} 
        disabled={selectedIndex === 0}
      >
        <ChevronLeft size={24} />
      </button>
      <div className="month-display">
        {months[selectedIndex]?.Name || 'Выберите месяц'}
      </div>
      <button 
        className="month-nav-button" 
        onClick={handleNextMonth} 
        disabled={selectedIndex === months.length - 1}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MonthCarousel;