import React, { useState, useEffect } from 'react';
import MonthCarousel from './components/MonthCarousel';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-months');
        if (!response.ok) throw new Error('Failed to fetch months');
        const data = await response.json();
        setMonths(data);
        if (data.length > 0) {
          setSelectedMonth(data[0].Name);
        }
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };

    fetchMonths();
  }, []);

  return (
    <div className="app">
      <DatabaseStatus />
      {months.length > 0 && (
        <MonthCarousel
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
      )}
      <div>Выбранный месяц: {selectedMonth}</div>
    </div>
  );
};

export default App;