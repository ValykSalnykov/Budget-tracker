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
    <div className="weekly-summary">
      <div className="summary-content">
        <div className="summary-item" >
          <span>Итого доходов</span>
          <span>{summary.IncomeSum}</span>
        </div>
        <div className="summary-item">
          <span>Итого основных расходов</span>
          <span>{summary.GeneralExpensesSum}</span>
        </div>
        <div className="summary-item">
          <span>Итого личных расходов</span>
          <span>{summary.PersonalExpensesSum}</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;