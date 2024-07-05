import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isLoading, setIsLoading] = useState({ months: true, weeks: false });
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, errorMessage) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  }, []);

  const fetchMonths = useCallback(async () => {
    try {
      const data = await fetchData('/.netlify/functions/get-months', 'Failed to fetch months');
      setMonths(data);
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthData = data.find(month => month.monthNumber === currentMonth) || data[0];
      setSelectedMonth(currentMonthData?.MonthId);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, months: false }));
    }
  }, [fetchData]);

  const fetchWeeks = useCallback(async (monthId) => {
    if (!monthId) return;
    setIsLoading(prev => ({ ...prev, weeks: true }));
    try {
      const data = await fetchData(`/.netlify/functions/get-weeks?monthId=${monthId}`, 'Failed to fetch weeks');
      setWeeks(data);
      setSelectedWeek(data[0]?.WeeksId);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, weeks: false }));
    }
  }, [fetchData]);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  useEffect(() => {
    if (selectedMonth) {
      fetchWeeks(selectedMonth);
    }
  }, [selectedMonth, fetchWeeks]);

  const handleMonthSelect = useCallback((monthId) => {
    setSelectedMonth(monthId);
    setSelectedWeek(null);
  }, []);

  const handleWeekSelect = useCallback((weekId) => {
    setSelectedWeek(weekId);
  }, []);

  const content = useMemo(() => {
    if (isLoading.months) return <div className="loading">Загрузка месяцев...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
      <>
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
          isLoading={isLoading.weeks}
        />
      </>
    );
  }, [months, selectedMonth, handleMonthSelect, weeks, selectedWeek, handleWeekSelect, isLoading.weeks, isLoading.months, error]);

  return (
    <div className="app">
      <DatabaseStatus />
      {content}
    </div>
  );
};

export default App;