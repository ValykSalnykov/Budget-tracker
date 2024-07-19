/**
 * @fileoverview Компонент для отображения еженедельной сводки финансов.
 * @module WeeklySummary
 * @requires react
 * @requires framer-motion
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
    return <div className="text-red-500 font-bold">{error}</div>;
  }

  if (!summary) {
    return <div className="text-gray-500">Загрузка итогов недели...</div>;
  }

  return (
    <motion.div className="flex justify-evenly items-stretch bg-white rounded-xl shadow-lg p-4 mt-8 transition-all duration-300">
      <SummaryItem title="Итого доходов:" value={summary.IncomeSum} extraClasses="w-1/4" />
      <SummaryItem title="Итого основных расходов:" value={summary.GeneralExpensesSum} extraClasses="w-1/2" />
      <SummaryItem title="Итого личных расходов:" value={summary.PersonalExpensesSum} extraClasses="w-1/2" />
    </motion.div>
  );
};

const SummaryItem = ({ title, value, extraClasses }) => (
  <motion.div
    className={`flex flex-col justify-center items-center ${extraClasses}`}
    key={`${title}-${value}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-medium text-blue-600 mb-1">{title}</h3>
    <span className="text-2xl font-bold text-gray-800">{value}</span>
  </motion.div>
);

export default WeeklySummary;