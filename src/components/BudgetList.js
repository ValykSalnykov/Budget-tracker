import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('BudgetList useEffect triggered');
    console.log('selectedWeek:', selectedWeek);
    console.log('weeks:', weeks);

    if (weeks && weeks.length > 0 && selectedWeek !== null && weeks[selectedWeek]) {
      const weekId = weeks[selectedWeek].WeeksId;
      console.log('Fetching data for weekId:', weekId);
      setIsLoading(true);
      setError(null);

      Promise.all([
        fetch(`/.netlify/functions/get-income?weekId=${weekId}`),
        fetch(`/.netlify/functions/get-general-expenses?weekId=${weekId}`),
        fetch(`/.netlify/functions/get-personal-expenses?weekId=${weekId}`)
      ])
        .then(async ([incomeRes, generalExpensesRes, personalExpensesRes]) => {
          const income = await incomeRes.json();
          const generalExpenses = await generalExpensesRes.json();
          const personalExpenses = await personalExpensesRes.json();

          console.log('Fetched data:', { income, generalExpenses, personalExpenses });

          setIncomeData(income);
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
    } else {
      console.log('Conditions not met for fetching data');
    }
  }, [selectedWeek, weeks]);

  if (!weeks || weeks.length === 0) {
    return <div>Нет доступных недель для выбора.</div>;
  }

  if (selectedWeek === null) {
    return <div>Пожалуйста, выберите неделю для просмотра бюджета.</div>;
  }

  if (isLoading) {
    return <div>Загрузка данных бюджета...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="budget-list">
      <IncomeList incomes={incomeData} />
      <GeneralExpensesList expenses={generalExpensesData} />
      <PersonalExpensesList expenses={personalExpensesData} />
    </div>
  );
});

export default BudgetList;