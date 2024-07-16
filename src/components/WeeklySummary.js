/**
 * @fileoverview Компонент для отображения еженедельной сводки финансов.
 * @module WeeklySummary
 * @requires react
 * @requires framer-motion
 * @requires ../styles/WeeklySummary.css
 *
 * @description
 * Этот компонент отображает еженедельную финансовую сводку, включая
 * общую сумму доходов, основных и личных расходов. Он динамически
 * загружает данные для выбранной недели и отображает их с анимацией.
 *
 * @component
 * @param {Object} props - Свойства компонента
 * @param {number} props.selectedWeek - Индекс выбранной недели
 * @param {Array} props.weeks - Массив объектов с информацией о неделях
 * @param {number} props.triggerUpdate - Триггер для обновления данных
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/WeeklySummary.css';

const WeeklySummary = ({ selectedWeek, weeks, triggerUpdate }) => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
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
  }, [selectedWeek, weeks]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, triggerUpdate]);

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
        key={`income-${summary.IncomeSum}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Итого доходов: </h3>
        <span>{summary.IncomeSum}</span>
      </motion.div>
      <motion.div
        className="weekly-summary-item"
        key={`general-${summary.GeneralExpensesSum}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Итого основных расходов: </h3>
        <span>{summary.GeneralExpensesSum}</span>
      </motion.div>
      <motion.div
        className="weekly-summary-item"
        key={`personal-${summary.PersonalExpensesSum}`}
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