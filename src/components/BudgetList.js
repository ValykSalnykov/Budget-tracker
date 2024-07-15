/**
 * @fileoverview Компонент для отображения и управления бюджетом, включая доходы, общие и личные расходы.
 * @module BudgetList
 */

import React, { useState, useEffect, useCallback } from 'react';
import IncomeList from './IncomeList';
import GeneralExpensesList from './GeneralExpensesList';
import PersonalExpensesList from './PersonalExpensesList';
import WeeklySummary from './WeeklySummary';
import ResidueSummary from './ResidueSummary';
import '../styles/BudgetList.css';

/**
 * Компонент BudgetList отображает и управляет бюджетом для выбранной недели.
 * 
 * @function BudgetList
 * @param {Object} props - Свойства компонента
 * @param {number|null} props.selectedWeek - Индекс выбранной недели
 * @param {Array} props.weeks - Массив недель
 * @param {string} props.selectedMonth - ID выбранного месяца
 * @returns {React.ReactElement} Отрендеренный компонент BudgetList
 */
const BudgetList = React.memo(({ selectedWeek, weeks, selectedMonth }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [generalExpensesData, setGeneralExpensesData] = useState([]);
  const [personalExpensesData, setPersonalExpensesData] = useState([]);
  const [, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  /**
   * Функция для запуска обновления данных.
   * @function triggerUpdate
   */
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  /**
   * Асинхронная функция для загрузки данных о доходах.
   * 
   * @async
   * @function fetchIncomeData
   * @param {string} weekId - ID недели
   */
  const fetchIncomeData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-income?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные о доходах');
      }
      const data = await response.json();
      setIncomeData(data);
    } catch (err) {
      setError('Ошибка при загрузке данных о доходах');
      console.error('Ошибка при загрузке данных о доходах:', err);
    }
  }, []);

  /**
   * Асинхронная функция для загрузки данных об общих расходах.
   * 
   * @async
   * @function fetchGeneralExpensesData
   * @param {string} weekId - ID недели
   */
  const fetchGeneralExpensesData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-general-expenses?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные об общих расходах');
      }
      const data = await response.json();
      setGeneralExpensesData(data);
    } catch (err) {
      setError('Ошибка при загрузке данных об общих расходах');
      console.error('Ошибка при загрузке данных об общих расходах:', err);
    }
  }, []);

  /**
   * Асинхронная функция для загрузки данных о личных расходах.
   * 
   * @async
   * @function fetchPersonalExpensesData
   * @param {string} weekId - ID недели
   */
  const fetchPersonalExpensesData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-personal-expenses?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные о личных расходах');
      }
      const data = await response.json();
      setPersonalExpensesData(data);
    } catch (err) {
      setError('Ошибка при загрузке данных о личных расходах');
      console.error('Ошибка при загрузке данных о личных расходах:', err);
    }
  }, []);

  // Эффект для загрузки всех данных при изменении выбранной недели
  useEffect(() => {
    if (weeks && weeks.length > 0 && selectedWeek !== null && weeks[selectedWeek]) {
      const weekId = weeks[selectedWeek].WeeksId;
      setIsLoading(true);
      setError(null);

      Promise.all([
        fetchIncomeData(weekId),
        fetch(`/.netlify/functions/get-general-expenses?weekId=${weekId}`),
        fetch(`/.netlify/functions/get-personal-expenses?weekId=${weekId}`)
      ])
        .then(async ([, generalExpensesRes, personalExpensesRes]) => {
          const generalExpenses = await generalExpensesRes.json();
          const personalExpenses = await personalExpensesRes.json();

          setGeneralExpensesData(generalExpenses);
          setPersonalExpensesData(personalExpenses);
        })
        .catch(err => {
          setError('Не удалось загрузить данные бюджета');
          console.error('Ошибка при загрузке данных:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedWeek, weeks, fetchIncomeData]);

  /**
   * Асинхронная функция для добавления общего расхода.
   * 
   * @async
   * @function handleAddGeneralExpense
   * @param {string} description - Описание расхода
   * @param {number} amount - Сумма расхода
   */
  const handleAddGeneralExpense = useCallback(async (description, amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-general-expense', {
        method: 'POST',
        body: JSON.stringify({ description, amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Не удалось добавить общий расход');
      }
      await fetchGeneralExpensesData(weekId);
      triggerUpdate();
    } catch (err) {
      setError('Ошибка при добавлении общего расхода');
      console.error('Ошибка при добавлении общего расхода:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для обновления общего расхода.
   * 
   * @async
   * @function handleUpdateGeneralExpense
   * @param {string} id - ID расхода
   * @param {string} description - Новое описание расхода
   * @param {number} amount - Новая сумма расхода
   */
  const handleUpdateGeneralExpense = useCallback(async (id, description, amount) => {
    try {
      if (weeks && selectedWeek !== null) {
        const weekId = weeks[selectedWeek].WeeksId;
        const response = await fetch('/.netlify/functions/update-general-expense', {
          method: 'PUT',
          body: JSON.stringify({ id, description, amount, weekId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Не удалось обновить общий расход');
        }
        await fetchGeneralExpensesData(weekId);
        triggerUpdate();
      } else {
        throw new Error('Неделя не выбрана');
      }
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при обновлении общего расхода:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для удаления общего расхода.
   * 
   * @async
   * @function handleDeleteGeneralExpense
   * @param {string} id - ID удаляемого расхода
   */
  const handleDeleteGeneralExpense = useCallback(async (id) => {
    try {
      const response = await fetch('/.netlify/functions/delete-general-expense', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Не удалось удалить общий расход');
      }
      if (weeks && selectedWeek !== null) {
        await fetchGeneralExpensesData(weeks[selectedWeek].WeeksId);
        triggerUpdate();
      }
    } catch (err) {
      setError('Ошибка при удалении общего расхода');
      console.error('Ошибка при удалении общего расхода:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для добавления личного расхода.
   * 
   * @async
   * @function handleAddPersonalExpense
   * @param {string} description - Описание расхода
   * @param {number} amount - Сумма расхода
   */
  const handleAddPersonalExpense = useCallback(async (description, amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-personal-expense', {
        method: 'POST',
        body: JSON.stringify({ description, amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Не удалось добавить личный расход');
      }
      await fetchPersonalExpensesData(weekId);
      triggerUpdate();
    } catch (err) {
      setError('Ошибка при добавлении личного расхода');
      console.error('Ошибка при добавлении личного расхода:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для обновления личного расхода.
   * 
   * @async
   * @function handleUpdatePersonalExpense
   * @param {string} id - ID расхода
   * @param {string} description - Новое описание расхода
   * @param {number} amount - Новая сумма расхода
   */
  const handleUpdatePersonalExpense = useCallback(async (id, description, amount) => {
    try {
      if (weeks && selectedWeek !== null) {
        const weekId = weeks[selectedWeek].WeeksId;
        const response = await fetch('/.netlify/functions/update-personal-expense', {
          method: 'PUT',
          body: JSON.stringify({ id, description, amount, weekId }),
        });
        if (!response.ok) {
          throw new Error('Не удалось обновить личный расход');
        }
        await fetchPersonalExpensesData(weekId);
        triggerUpdate();
      }
    } catch (err) {
      setError('Ошибка при обновлении личного расхода');
      console.error('Ошибка при обновлении личного расхода:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для удаления личного расхода.
   * 
   * @async
   * @function handleDeletePersonalExpense
   * @param {string} id - ID удаляемого расхода
   */
  const handleDeletePersonalExpense = useCallback(async (id) => {
    try {
      const response = await fetch('/.netlify/functions/delete-personal-expense', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Не удалось удалить личный расход');
      }
      if (weeks && selectedWeek !== null) {
        await fetchPersonalExpensesData(weeks[selectedWeek].WeeksId);
        triggerUpdate();
      }
    } catch (err) {
      setError('Ошибка при удалении личного расхода');
      console.error('Ошибка при удалении личного расхода:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData, triggerUpdate]);

  /**
   * Асинхронная функция для добавления дохода.
   * 
   * @async
   * @function handleAddIncome
   * @param {number} amount - Сумма дохода
   */
  const handleAddIncome = useCallback(async (amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-income', {
        method: 'POST',
        body: JSON.stringify({ amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Не удалось добавить доход');
      }
      await fetchIncomeData(weekId);
      triggerUpdate();
    } catch (err) {
      setError('Ошибка при добавлении дохода');
      console.error('Ошибка при добавлении дохода:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData, triggerUpdate]);

  /**
   * Обновляет информацию о доходе.
   * @function
   * @async
   * @param {string|number} id - Идентификатор дохода для обновления.
   * @param {number} amount - Новая сумма дохода.
   * @throws {Error} Выбрасывает ошибку, если обновление не удалось.
   */
  const handleUpdateIncome = useCallback(async (id, amount) => {
    try {
      if (weeks && selectedWeek !== null) {
        const weekId = weeks[selectedWeek].WeeksId;
        const response = await fetch('/.netlify/functions/update-income', {
          method: 'PUT',
          body: JSON.stringify({ id, amount, weekId }),
        });
        if (!response.ok) {
          throw new Error('Failed to update income');
        }
        await fetchIncomeData(weekId);
        triggerUpdate();
      }
    } catch (err) {
      setError('Error updating income');
      console.error('Error updating income:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData, triggerUpdate]);

  /**
   * Удаляет информацию о доходе.
   * @function
   * @async
   * @param {string|number} id - Идентификатор дохода для удаления.
   * @throws {Error} Выбрасывает ошибку, если удаление не удалось.
   */
  const handleDeleteIncome = useCallback(async (id) => {
    try {
      const response = await fetch('/.netlify/functions/delete-income', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete income');
      }
      if (weeks && selectedWeek !== null) {
        await fetchIncomeData(weeks[selectedWeek].WeeksId);
        triggerUpdate();
      }
    } catch (err) {
      setError('Error deleting income');
      console.error('Error deleting income:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData, triggerUpdate]);

  /**
   * Отображает компонент бюджетного списка.
   * @function
   * @returns {JSX.Element} Возвращает JSX элемент, отображающий бюджетный список.
   */
  return (
    <div className="budget-container">
      <ResidueSummary selectedMonth={selectedMonth} selectedWeek={selectedWeek} weeks={weeks}  triggerUpdate={updateTrigger} />
      <div className="lists-container">
        <div className="list-column">
          <IncomeList 
            incomes={incomeData} 
            onAddIncome={handleAddIncome}
            onUpdateIncome={handleUpdateIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        </div>
        <div className="list-column">
          <GeneralExpensesList 
            expenses={generalExpensesData}
            onAddExpense={handleAddGeneralExpense}
            onUpdateExpense={handleUpdateGeneralExpense}
            onDeleteExpense={handleDeleteGeneralExpense}
          />
        </div>
        <div className="list-column">
          <PersonalExpensesList 
            expenses={personalExpensesData}
            onAddExpense={handleAddPersonalExpense}
            onUpdateExpense={handleUpdatePersonalExpense}
            onDeleteExpense={handleDeletePersonalExpense}
          />
        </div>
      </div>
      <WeeklySummary selectedWeek={selectedWeek} weeks={weeks} triggerUpdate={updateTrigger}/>
    </div>
  );
});

export default BudgetList;