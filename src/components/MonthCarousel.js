import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MonthCarousel = ({ selectedMonth, onSelectMonth }) => {
  const selectedIndex = months.indexOf(selectedMonth);

  return (
    <Carousel
      showArrows={true}
      showStatus={false}
      showIndicators={false}
      infiniteLoop={true}
      selectedItem={selectedIndex}
      onChange={(index) => onSelectMonth(months[index])}
      renderThumbs={() => {}}
    >
      {months.map(month => (
        <div key={month} className="month-item">
          {month}
        </div>
      ))}
    </Carousel>
  );
};

export default MonthCarousel;