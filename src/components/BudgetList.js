import React, { useState, useEffect, useCallback } from 'react';
import IncomeList from './IncomeList';
import GeneralExpensesList from './GeneralExpensesList';
import PersonalExpensesList from './PersonalExpensesList';
import WeeklySummary from './WeeklySummary';
import ResidueSummary from './ResidueSummary';
import '../styles/BudgetList.css';

const BudgetList = React.memo(({ selectedWeek, weeks, selectedMonth }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [generalExpensesData, setGeneralExpensesData] = useState([]);
  const [personalExpensesData, setPersonalExpensesData] = useState([]);
  const [, setIsLoading] = useState(false);
  const [, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

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