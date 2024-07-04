import React, { useState, useEffect, useCallback} from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

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
        
        const currentMonth = new Date().getMonth() + 1;
        
        const currentMonthData = data.find(month => month.monthNumber === currentMonth);
        
        if (currentMonthData) {
          setSelectedMonth(currentMonthData.MonthId);
        } else if (data.length > 0) {
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

  const fetchWeeks = useCallback(async (monthId) => {
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
  }, []);

  const debouncedFetchWeeks = useCallback(
    debounce((monthId) => fetchWeeks(monthId), 100),
    [fetchWeeks]
  );

  useEffect(() => {
    if (selectedMonth) {
      setWeeks([]);
      debouncedFetchWeeks(selectedMonth);
    }
  }, [selectedMonth, debouncedFetchWeeks]);

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