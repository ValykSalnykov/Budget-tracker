import React from 'react';
import '../styles/IncomeList.css';

const IncomeList = React.memo(({ incomes }) => {
  return (
    <div className="income-list">
      <h2>Доходы</h2>
      <ul>
        {incomes.map(income => (
          <li key={income.IncomeId} className="income-item">
            <span className="income-amount">{income.Amount} ₴</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default IncomeList;