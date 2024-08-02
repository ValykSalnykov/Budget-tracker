import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="flex justify-evenly items-center bg-white rounded-xl shadow-lg p-4 mt-8 transition-all duration-300" role="region" aria-label="Month selection">
      <button 
        className={`px-6 py-2 bg-blue-500 text-white rounded-full font-medium transition-all duration-500 ease-in-out ${selectedIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:px-12'}`}
        onClick={handlePrevMonth} 
        disabled={selectedIndex === 0}
        aria-label="Previous month"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="text-3xl min-w-[200px] text-center text-gray-800" aria-live="polite">
        {months[selectedIndex]?.Name || 'Выберите месяц'}
      </div>
      <button 
        className={`px-6 py-2 bg-blue-500 text-white rounded-full font-medium transition-all duration-500 ease-in-out ${selectedIndex === months.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:px-12'}`}
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