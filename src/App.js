import React, { useState, useEffect } from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

// Utility function for debounce
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);
  const [isLoadingWeeks, setIsLoadingWeeks] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonths = async () => {
      setIsLoadingMonths(true);
      setError(null);
      try {
        const response = await fetch('/.netlify/functions/get-months');
        if (!response.ok) {
          throw new Error('Failed to fetch months');
        }
        const data = await response.json();
        setMonths(data);
        
        // Get current month number (1-12)
        const currentMonth = new Date().getMonth() + 1;
        
        // Find the month object that corresponds to the current month
        const currentMonthData = data.find(month => month.monthNumber === currentMonth);
        
        if (currentMonthData) {
          setSelectedMonth(currentMonthData.MonthId);
        } else if (data.length > 0) {
          // Fallback to first month if current month not found
          setSelectedMonth(data[0].MonthId);
        }
      } catch (error) {
        console.error('Error fetching months:', error);
        setError('Failed to load months. Please try again later.');
      } finally {
        setIsLoadingMonths(false);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    const fetchWeeks = async (monthId) => {
      setIsLoadingWeeks(true);
      setError(null);
      try {
        const response = await fetch(`/.netlify/functions/get-weeks?monthId=${monthId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch weeks: ${errorData.error}`);
        }
        const data = await response.json();
        setWeeks(data);
        setSelectedWeek(data.length > 0 ? data[0].WeeksId : null);
      } catch (error) {
        console.error('Error fetching weeks:', error);
        setError('Failed to load weeks. Please try again later.');
      } finally {
        setIsLoadingWeeks(false);
      }
    };

    const debouncedFetchWeeks = debounce((monthId) => fetchWeeks(monthId), 300);

    if (selectedMonth) {
      setWeeks([]); // Clear weeks immediately
      debouncedFetchWeeks(selectedMonth);
    }

    // Cleanup function to cancel any pending debounced calls
    return () => debouncedFetchWeeks.cancel();
  }, [selectedMonth]);

  const handleMonthSelect = (monthId) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);
  };

  const handleWeekSelect = (weekId) => {
    setSelectedWeek(weekId);
  };

  if (isLoadingMonths) {
    return <div className="loading">Загрузка месяцев...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
        onSelectWeek={handleWeekSelect}
        isLoading={isLoadingWeeks}
      />
    </div>
  );
};

export default App;