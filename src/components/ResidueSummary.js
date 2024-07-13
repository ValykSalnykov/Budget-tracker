import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/ResidueSummary.css';

const ResidueSummary = ({ selectedMonth, selectedWeek, weeks, triggerUpdate }) => {
  const [monthlyResidue, setMonthlyResidue] = useState(null);
  const [weeklyResidue, setWeeklyResidue] = useState(null);
  const [error, setError] = useState(null);

  const fetchMonthlyResidue = useCallback(async () => {
    if (!selectedMonth) return;

    try {
      const response = await fetch(`/.netlify/functions/get-residue-summary?monthId=${selectedMonth}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly residue');
      }
      const data = await response.json();
      setMonthlyResidue(data.TotalResidue);
    } catch (err) {
      setError('Error fetching monthly residue');
      console.error('Error fetching monthly residue:', err);
    }
  }, [selectedMonth]);

  const fetchWeeklyResidue = useCallback(async () => {
    if (selectedWeek === null || !weeks[selectedWeek]) return;

    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch(`/.netlify/functions/get-weekly-summary?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weekly summary');
      }
      const data = await response.json();
      const residue = data.IncomeSum - data.GeneralExpensesSum - data.PersonalExpensesSum;
      setWeeklyResidue(residue);
    } catch (err) {
      setError('Error fetching weekly residue');
      console.error('Error fetching weekly residue:', err);
    }
  }, [selectedWeek, weeks]);

  useEffect(() => {
    fetchMonthlyResidue();
    fetchWeeklyResidue();
  }, [fetchMonthlyResidue, fetchWeeklyResidue, triggerUpdate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (monthlyResidue === null || weeklyResidue === null) {
    return <div className="loading">Загрузка итогов месяца...</div>;
  }

  return (
    <motion.div className="residue-container">
      <motion.div 
        className="residue-summary-item"
        key={`monthly-${monthlyResidue}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Остаток месяца: </h3>
        <span> {monthlyResidue}</span>
      </motion.div>
      <motion.div 
        className="residue-summary-item"
        key={`weekly-${weeklyResidue}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Остаток недели:  </h3>
        <span>{weeklyResidue}</span>
      </motion.div>
    </motion.div>
  );
};

export default ResidueSummary;