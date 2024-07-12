import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/WeeklySummary.css';

const WeeklySummary = ({ selectedWeek, weeks }) => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (selectedWeek === null || !weeks[selectedWeek]) return;

      const weekId = weeks[selectedWeek].WeeksId;
      try {
        const response = await fetch(`/.netlify/functions/get-weekly-summary?weekId=${weekId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weekly summary');
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError('Error fetching weekly summary');
        console.error('Error fetching weekly summary:', err);
      }
    };

    fetchSummary();
  }, [selectedWeek, weeks]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!summary) {
    return <div className="loading">Загрузка итогов недели...</div>;
  }

  return (
    <motion.div className="weekly-container">
        <motion.div
          className="weekly-summary-item"
          key={summary.IncomeSum}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Итого доходов: </h3>
          <span>{summary.IncomeSum}</span>
        </motion.div>
        <motion.div
          className="weekly-summary-item"
          key={summary.GeneralExpensesSum}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Итого основных расходов: </h3>
          <span>{summary.GeneralExpensesSum}</span>
        </motion.div>
        <motion.div
          className="weekly-summary-item"
          key={summary.PersonalExpensesSum}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Итого личных расходов: </h3>
          <span>{summary.PersonalExpensesSum}</span>
        </motion.div>
    </motion.div>
  );
};

export default WeeklySummary;