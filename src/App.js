import React, { useState, useEffect } from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-months');
        if (!response.ok) throw new Error('Failed to fetch months');
        const data = await response.json();
        setMonths(data);
        if (data.length > 0) {
          setSelectedMonth(data[0].MonthId);
        }
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    const fetchWeeks = async () => {
      if (selectedMonth) {
        try {
          const response = await fetch(`/.netlify/functions/get-weeks?monthId=${selectedMonth}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch weeks: ${errorData.error}`);
          }
          const data = await response.json();
          setWeeks(data);
          setSelectedWeek(data.length > 0 ? 0 : null);
        } catch (error) {
          console.error('Error fetching weeks:', error);
        }
      }
    };

    fetchWeeks();
  }, [selectedMonth]);

  const handleMonthSelect = (monthId) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);
    setWeeks([]);
  };

  return (
    <div className="app">
      <DatabaseStatus />
      {months.length > 0 && (
        <MonthCarousel
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={handleMonthSelect}
        />
      )}
      <WeekSelector
        weeks={weeks}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />
    </div>
  );
};

export default App;