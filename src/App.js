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
  const [debugInfo, setDebugInfo] = useState('');

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
        setDebugInfo(`Error fetching months: ${error.message}`);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    const fetchWeeks = async () => {
      if (selectedMonth) {
        try {
          setDebugInfo(`Fetching weeks for month ID: ${selectedMonth}`);
          const response = await fetch(`/.netlify/functions/get-weeks?monthId=${selectedMonth}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch weeks: ${errorData.error}, ${errorData.details}`);
          }
          const data = await response.json();
          setDebugInfo(`Weeks data received: ${JSON.stringify(data)}`);
          setWeeks(data);
          setSelectedWeek(data.length > 0 ? 0 : null);
        } catch (error) {
          console.error('Error fetching weeks:', error);
          setDebugInfo(`Error fetching weeks: ${error.message}`);
        }
      }
    };
  
    fetchWeeks();
  }, [selectedMonth]);

  const handleMonthSelect = (monthId) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);
    setDebugInfo(`Month selected: ${monthId}`);
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
      {weeks.length > 0 && (
        <WeekSelector
          weeks={weeks}
          selectedWeek={selectedWeek}
          onSelectWeek={setSelectedWeek}
        />
      )}
      <div>Выбранный месяц: {months.find(m => m.MonthId === selectedMonth)?.Name}</div>
      <div>Выбранная неделя: {selectedWeek !== null ? `Неделя ${weeks[selectedWeek]?.weekNumber}` : 'Не выбрана'}</div>
      <div>Debug Info: {debugInfo}</div>
    </div>
  );
};

export default App;