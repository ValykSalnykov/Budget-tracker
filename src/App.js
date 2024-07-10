import React, { useState, useEffect, useCallback } from 'react';
import MonthCarousel from './components/MonthCarousel';
import WeekSelector from './components/WeekSelector';
import DatabaseStatus from './components/DatabaseStatus';
import BudgetList from './components/BudgetList';
import './App.css';

const App = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isLoading, setIsLoading] = useState({ months: true, weeks: false });
  const [, setError] = useState(null);

  const fetchData = useCallback(async (url, errorMessage) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  }, []);

  const fetchMonths = useCallback(async () => {
    try {
      console.log('Fetching months...');
      const data = await fetchData('/.netlify/functions/get-months', 'Failed to fetch months');
      console.log('Fetched months data:', data);
      setMonths(data);
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthData = data.find(month => month.monthNumber === currentMonth) || data[0];
      console.log('Current month data:', currentMonthData);
      setSelectedMonth(currentMonthData?.MonthId);
    } catch (error) {
      console.error('Error in fetchMonths:', error);
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, months: false }));
    }
  }, [fetchData]);

  const fetchWeeks = useCallback(async (monthId) => {
    if (!monthId) return;
    setIsLoading(prev => ({ ...prev, weeks: true }));
    try {
      const response = await fetch(`/.netlify/functions/get-weeks?monthId=${monthId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weeks');
      }
      const data = await response.json();
      setWeeks(data);
      setSelectedWeek(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, weeks: false }));
    }
  }, []);

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

  const handleWeekSelect = useCallback((weekIndex) => {
    console.log('Selected week index:', weekIndex);
    setSelectedWeek(weekIndex);
  }, []);

  return (
    <div className="app">
      <DatabaseStatus/>
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
      {weeks.length > 0 && selectedWeek !== null && (
        <BudgetList selectedWeek={selectedWeek} weeks={weeks} selectedMonth={selectedMonth}/>
      )}
    </div>
  );
}

export default App;
