/**
 * @fileoverview Стили для компонента отображения сводки по остаткам.
 * @module ResidueSummary
 * @requires ../components/ResidueSummary
 *
 * @description
 * Этот файл содержит CSS-стили для компонента ResidueSummary.
 * Он определяет внешний вид контейнера остатков, отдельных элементов остатков,
 * заголовков и сводной информации. Стили используют переменные CSS для гибкой
 * настройки цветовой схемы.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    return <div className="text-red-600 font-bold">{error}</div>;
  }

  if (monthlyResidue === null || weeklyResidue === null) {
    return <div className="text-gray-600">Загрузка итогов месяца...</div>;
  }

  const formatCurrency = (value) => {
    if (value === null || isNaN(value)) return 'Н/Д';
    return value.toFixed(0);
  };

  return (
    <div className="flex justify-evenly items-center bg-white rounded-xl shadow-lg p-4 mt-8 transition-all duration-300">
      <ResidueItem title="Остаток месяца:" value={monthlyResidue} />
      <ResidueItem title="Остаток недели:" value={weeklyResidue} />
      <ResidueItem title="Остаток в день:" value={formatCurrency(dailySpendingLimit)} />
    </div>
  );
};

const ResidueItem = ({ title, value }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
    <motion.div 
      className="text-3xl font-bold text-blue-500"
      key={value}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.div>
  </div>
);

export default ResidueSummary;