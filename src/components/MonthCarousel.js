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
 *
 * @example
 * import MonthCarousel from './components/MonthCarousel';
 *
 * function App() {
 *   const months = [
 *     { MonthId: '1', Name: 'Январь' },
 *     { MonthId: '2', Name: 'Февраль' },
 *     // ...
 *   ];
 *   const [selectedMonth, setSelectedMonth] = useState('1');
 *
 *   return (
 *     <MonthCarousel
 *       months={months}
 *       selectedMonth={selectedMonth}
 *       onSelectMonth={setSelectedMonth}
 *     />
 *   );
 * }
 */

import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/MonthCarousel.css';

/**
 * Компонент карусели месяцев.
 *
 * @function MonthCarousel
 * @param {Object} props - Свойства компонента
 * @param {Array} props.months - Массив объектов месяцев
 * @param {string} props.selectedMonth - ID выбранного месяца
 * @param {function} props.onSelectMonth - Функция обратного вызова для выбора месяца
 * @returns {React.ReactElement} Отрендеренный компонент MonthCarousel
 */
const MonthCarousel = React.memo(({ months, selectedMonth, onSelectMonth }) => {
  /**
   * Индекс выбранного месяца в массиве месяцев.
   * @type {number}
   */
  const selectedIndex = useMemo(() => 
    months.findIndex(month => month.MonthId === selectedMonth),
    [months, selectedMonth]
  );

  /**
   * Обработчик для перехода к предыдущему месяцу.
   * @function
   */
  const handlePrevMonth = useCallback(() => {
    if (selectedIndex > 0) {
      onSelectMonth(months[selectedIndex - 1].MonthId);
    }
  }, [selectedIndex, months, onSelectMonth]);

  /**
   * Обработчик для перехода к следующему месяцу.
   * @function
   */
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