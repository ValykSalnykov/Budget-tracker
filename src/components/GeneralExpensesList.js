import React from 'react';
import '../styles/GeneralExpensesList.css';

const GeneralExpensesList = React.memo(({ expenses }) => {
  return (
    <div className="general-expenses-list">
      <h2>Основные расходы</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.GeneralExpensesId} className="expense-item">
            <span className="expense-description">{expense.Description}</span>
            <span className="expense-amount">{expense.Amount} ₴</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default GeneralExpensesList;