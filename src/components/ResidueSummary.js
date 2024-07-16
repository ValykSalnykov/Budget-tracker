import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/ResidueSummary.css';

const ResidueSummary = ({ selectedMonth, selectedWeek, weeks, triggerUpdate }) => {
  const [monthlyResidue, setMonthlyResidue] = useState(null);
  const [weeklyResidue, setWeeklyResidue] = useState(null);
  const [dailySpendingLimit, setDailySpendingLimit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyResidue = async () => {
      if (!selectedMonth) return;

      try {
        const response = await fetch(`/.netlify/functions/get-residue-summary?monthId=${selectedMonth}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить месячный остаток');
        }
        const data = await response.json();
        setMonthlyResidue(data.MonthlyResidue);
        setDailySpendingLimit(parseFloat(data.DailySpendingLimit));
      } catch (err) {
        setError('Ошибка при загрузке месячного остатка');
        console.error('Ошибка при загрузке месячного остатка:', err);
      }
    };
    fetchMonthlyResidue();
  }, [selectedMonth, triggerUpdate]);

  useEffect(() => {
    const fetchWeeklyResidue = async () => {
      if (selectedWeek === null || !weeks[selectedWeek]) return;

      const weekId = weeks[selectedWeek].WeeksId;
      try {
        const response = await fetch(`/.netlify/functions/get-weekly-summary?weekId=${weekId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить недельную сводку');
        }
        const data = await response.json();
        const residue = data.IncomeSum - data.GeneralExpensesSum - data.PersonalExpensesSum;
        setWeeklyResidue(residue);
      } catch (err) {
        setError('Ошибка при загрузке недельного остатка');
        console.error('Ошибка при загрузке недельного остатка:', err);
      }
    };

    fetchWeeklyResidue();
  }, [selectedWeek, weeks, triggerUpdate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (monthlyResidue === null || weeklyResidue === null) {
    return <div className="loading">Загрузка итогов месяца...</div>;
  }

  const formatCurrency = (value) => {
    if (value === null || isNaN(value)) return 'Н/Д';
    return value.toFixed(2);
  };

  return (
    <motion.div
      className="residue-container"
    >
      <motion.div 
        className="residue-summary-item"
        key={monthlyResidue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Остаток месяца: </h3>
        <span> {monthlyResidue}</span>
      </motion.div>
      <motion.div 
        className="residue-summary-item"
        key={weeklyResidue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Остаток недели:  </h3>
        <span>{weeklyResidue}</span>
      </motion.div>
      <motion.div 
        className="residue-summary-item"
        key={dailySpendingLimit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Остаток в день: </h3>
        <span>{formatCurrency(dailySpendingLimit)}</span>
      </motion.div>
    </motion.div>
  );
};

export default ResidueSummary;