import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/WeeklySummary.css';

/**
 * Компонент WeeklySummary отображает итоговую информацию о бюджете за выбранную неделю.
 * 
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {number|null} props.selectedWeek - Индекс выбранной недели.
 * @param {Array} props.weeks - Массив объектов, представляющих недели.
 * @param {function} props.triggerUpdate - Функция для запуска обновления компонента.
 */
const WeeklySummary = ({ selectedWeek, weeks, triggerUpdate }) => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Получает итоговую информацию о бюджете за выбранную неделю.
   * 
   * @function
   * @async
   */
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

  /**
   * Отображает компонент с итоговой информацией о бюджете.
   * 
   * @returns {JSX.Element} Возвращает JSX элемент с анимированными блоками итоговой информации.
   */
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