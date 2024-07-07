import React, { useState, useEffect, useCallback } from 'react';
import IncomeList from './IncomeList';
import GeneralExpensesList from './GeneralExpensesList';
import PersonalExpensesList from './PersonalExpensesList';
import '../styles/BudgetList.css';

const BudgetList = React.memo(({ selectedWeek, weeks }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [generalExpensesData, setGeneralExpensesData] = useState([]);
  const [personalExpensesData, setPersonalExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIncomeData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-income?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch income data');
      }
      const data = await response.json();
      setIncomeData(data);
    } catch (err) {
      setError('Error fetching income data');
      console.error('Error fetching income data:', err);
    }
  }, []);

  const fetchGeneralExpensesData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-general-expenses?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch general expenses data');
      }
      const data = await response.json();
      setGeneralExpensesData(data);
    } catch (err) {
      setError('Error fetching general expenses data');
      console.error('Error fetching general expenses data:', err);
    }
  }, []);

  const fetchPersonalExpensesData = useCallback(async (weekId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-personal-expenses?weekId=${weekId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch personal expenses data');
      }
      const data = await response.json();
      setPersonalExpensesData(data);
    } catch (err) {
      setError('Error fetching personal expenses data');
      console.error('Error fetching personal expenses data:', err);
    }
  }, []);

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
          setError('Failed to fetch budget data');
          console.error('Error fetching data:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedWeek, weeks, fetchIncomeData]);

  const handleAddGeneralExpense = useCallback(async (description, amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-general-expense', {
        method: 'POST',
        body: JSON.stringify({ description, amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add general expense');
      }
      await fetchGeneralExpensesData(weekId);
    } catch (err) {
      setError('Error adding general expense');
      console.error('Error adding general expense:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData]);

  const handleUpdateGeneralExpense = useCallback(async (id, description, amount) => {
    try {
      const response = await fetch('/.netlify/functions/update-general-expense', {
        method: 'PUT',
        body: JSON.stringify({ id, description, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to update general expense');
      }
      if (weeks && selectedWeek !== null) {
        await fetchGeneralExpensesData(weeks[selectedWeek].WeeksId);
      }
    } catch (err) {
      setError('Error updating general expense');
      console.error('Error updating general expense:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData]);

  const handleDeleteGeneralExpense = useCallback(async (id) => {
    try {
      const response = await fetch('/.netlify/functions/delete-general-expense', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete general expense');
      }
      if (weeks && selectedWeek !== null) {
        await fetchGeneralExpensesData(weeks[selectedWeek].WeeksId);
      }
    } catch (err) {
      setError('Error deleting general expense');
      console.error('Error deleting general expense:', err);
    }
  }, [weeks, selectedWeek, fetchGeneralExpensesData]);

  const handleAddPersonalExpense = useCallback(async (description, amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-personal-expense', {
        method: 'POST',
        body: JSON.stringify({ description, amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add personal expense');
      }
      await fetchPersonalExpensesData(weekId);
    } catch (err) {
      setError('Error adding personal expense');
      console.error('Error adding personal expense:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData]);

  const handleUpdatePersonalExpense = useCallback(async (id, description, amount) => {
    try {
      const response = await fetch('/.netlify/functions/update-personal-expense', {
        method: 'PUT',
        body: JSON.stringify({ id, description, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to update personal expense');
      }
      if (weeks && selectedWeek !== null) {
        await fetchPersonalExpensesData(weeks[selectedWeek].WeeksId);
      }
    } catch (err) {
      setError('Error updating personal expense');
      console.error('Error updating personal expense:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData]);

  const handleDeletePersonalExpense = useCallback(async (id) => {
    try {
      const response = await fetch('/.netlify/functions/delete-personal-expense', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete personal expense');
      }
      if (weeks && selectedWeek !== null) {
        await fetchPersonalExpensesData(weeks[selectedWeek].WeeksId);
      }
    } catch (err) {
      setError('Error deleting personal expense');
      console.error('Error deleting personal expense:', err);
    }
  }, [weeks, selectedWeek, fetchPersonalExpensesData]);

  const handleAddIncome = useCallback(async (amount) => {
    if (!weeks || selectedWeek === null) return;
    const weekId = weeks[selectedWeek].WeeksId;
    try {
      const response = await fetch('/.netlify/functions/add-income', {
        method: 'POST',
        body: JSON.stringify({ amount, weekId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add income');
      }
      await fetchIncomeData(weekId);
    } catch (err) {
      setError('Error adding income');
      console.error('Error adding income:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData]);

  const handleUpdateIncome = useCallback(async (id, amount) => {
    try {
      const response = await fetch('/.netlify/functions/update-income', {
        method: 'PUT',
        body: JSON.stringify({ id, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to update income');
      }
      if (weeks && selectedWeek !== null) {
        await fetchIncomeData(weeks[selectedWeek].WeeksId);
      }
    } catch (err) {
      setError('Error updating income');
      console.error('Error updating income:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData]);

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
      }
    } catch (err) {
      setError('Error deleting income');
      console.error('Error deleting income:', err);
    }
  }, [weeks, selectedWeek, fetchIncomeData]);

  if (!weeks || weeks.length === 0) {
    return <div>Нет доступных недель для выбора.</div>;
  }

  if (selectedWeek === null) {
    return <div>Пожалуйста, выберите неделю для просмотра бюджета.</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="budget-list">
      <IncomeList 
        incomes={incomeData} 
        onAddIncome={handleAddIncome}
        onUpdateIncome={handleUpdateIncome}
        onDeleteIncome={handleDeleteIncome}
      />
      <GeneralExpensesList 
        expenses={generalExpensesData}
        onAddExpense={handleAddGeneralExpense}
        onUpdateExpense={handleUpdateGeneralExpense}
        onDeleteExpense={handleDeleteGeneralExpense}
      />
      <PersonalExpensesList 
        expenses={personalExpensesData}
        onAddExpense={handleAddPersonalExpense}
        onUpdateExpense={handleUpdatePersonalExpense}
        onDeleteExpense={handleDeletePersonalExpense}
      />
    </div>
  );
});

export default BudgetList;