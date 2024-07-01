import React, { useState } from 'react';
import MonthCarousel from './components/MonthCarousel';
import BudgetView from './components/BudgetView';
import DatabaseStatus from './components/DatabaseStatus';
import './App.css';

const initialSampleData = {
  'Апрель': {
    month: 'Апрель',
    monthBalance: 27200,
    weeks: [
      {
        start: '1 апреля',
        end: '7 апреля',
        weekBalance: 8500,
        income: [
          { id: 1, name: 'Зарплата', amount: 35000 },
          { id: 2, name: 'Возврат долга от друга', amount: 2000 },
        ],
        mainExpenses: [
          { id: 1, name: 'Аренда квартиры', amount: 15000 },
          { id: 2, name: 'Коммунальные услуги', amount: 3500 },
        ],
        personalExpenses: [
          { id: 1, name: 'Продукты', amount: 4500 },
          { id: 2, name: 'Транспорт', amount: 1000 },
          { id: 3, name: 'Кафе с друзьями', amount: 2500 },
          { id: 4, name: 'Покупка книги', amount: 2000 },
        ],
      },
      {
        start: '8 апреля',
        end: '14 апреля',
        weekBalance: 3700,
        income: [
          { id: 1, name: 'Подработка', amount: 10000 },
          { id: 2, name: 'Продажа старого телефона', amount: 5000 },
        ],
        mainExpenses: [
          { id: 1, name: 'Оплата интернета', amount: 1000 },
          { id: 2, name: 'Страховка', amount: 2000 },
        ],
        personalExpenses: [
          { id: 1, name: 'Продукты', amount: 3500 },
          { id: 2, name: 'Спортзал (месячный абонемент)', amount: 2500 },
          { id: 3, name: 'Одежда', amount: 2300 },
        ],
      },
      {
        start: '15 апреля',
        end: '21 апреля',
        weekBalance: 6000,
        income: [
          { id: 1, name: 'Премия на работе', amount: 15000 },
        ],
        mainExpenses: [
          { id: 1, name: 'Оплата кредита', amount: 5000 },
        ],
        personalExpenses: [
          { id: 1, name: 'Продукты', amount: 4000 },
          { id: 2, name: 'Подарок на день рождения друга', amount: 3000 },
          { id: 3, name: 'Кино и ужин', amount: 2000 },
        ],
      },
      {
        start: '22 апреля',
        end: '28 апреля',
        weekBalance: 5500,
        income: [
          { id: 1, name: 'Зарплата', amount: 35000 },
          { id: 2, name: 'Возврат налогов', amount: 3000 },
        ],
        mainExpenses: [
          { id: 1, name: 'Аренда квартиры', amount: 15000 },
          { id: 2, name: 'Оплата курсов английского', amount: 8000 },
        ],
        personalExpenses: [
          { id: 1, name: 'Продукты', amount: 5000 },
          { id: 2, name: 'Транспорт', amount: 1500 },
          { id: 3, name: 'Ремонт обуви', amount: 1000 },
          { id: 4, name: 'Косметика', amount: 2000 },
        ],
      },
      {
        start: '29 апреля',
        end: '30 апреля',
        weekBalance: 3500,
        income: [
          { id: 1, name: 'Подработка', amount: 7000 },
        ],
        mainExpenses: [
          { id: 1, name: 'Оплата мобильной связи', amount: 500 },
        ],
        personalExpenses: [
          { id: 1, name: 'Продукты', amount: 2000 },
          { id: 2, name: 'Покупка электронной книги', amount: 1000 },
        ],
      },
    ],
  },
};

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('Апрель');
  const [budgetData, setBudgetData] = useState(initialSampleData);

  const addBudgetItem = (newItem, weekIndex) => {
    setBudgetData(prevData => {
      const updatedData = { ...prevData };
      const currentMonth = updatedData[selectedMonth];
      const currentWeek = currentMonth.weeks[weekIndex];

      // Определяем, в какую категорию добавить новый элемент
      let targetCategory;
      if (newItem.type === 'income') {
        targetCategory = 'income';
      } else if (newItem.type === 'mainExpenses') {
        targetCategory = 'mainExpenses';
      } else if (newItem.type === 'personalExpenses') {
        targetCategory = 'personalExpenses';
      }

      // Добавляем новый элемент в соответствующую категорию
      currentWeek[targetCategory] = [
        ...currentWeek[targetCategory],
        { ...newItem, id: Date.now() } // используем текущее время как уникальный id
      ];

      // Пересчитываем баланс недели и месяца
      currentWeek.weekBalance = calculateWeekBalance(currentWeek);
      currentMonth.monthBalance = currentMonth.weeks.reduce((sum, week) => sum + week.weekBalance, 0);

      return updatedData;
    });
  };

  const calculateWeekBalance = (week) => {
    const totalIncome = week.income.reduce((sum, item) => sum + item.amount, 0);
    const totalMainExpenses = week.mainExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalPersonalExpenses = week.personalExpenses.reduce((sum, item) => sum + item.amount, 0);
    return totalIncome - totalMainExpenses - totalPersonalExpenses;
  };

  return (
    <div className="app">
      <DatabaseStatus />
      <MonthCarousel selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
      <BudgetView 
        monthData={budgetData[selectedMonth]} 
        onAddItem={(newItem, weekIndex) => addBudgetItem(newItem, weekIndex)}
      />
    </div>
  );
};

export default App;