import React from 'react';
import '../styles/PersonalExpensesList.css';

const PersonalExpensesList = React.memo(({ expenses }) => {
  return (
    <div className="personal-expenses-list">
      <h2>Личные расходы</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.PersonalExpensesId} className="expense-item">
            <span className="expense-description">{expense.Description}</span>
            <span className="expense-amount">{expense.Amount} ₴</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PersonalExpensesList;