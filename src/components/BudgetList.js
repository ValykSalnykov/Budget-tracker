import React from 'react';
import BudgetItem from './BudgetItem';

const BudgetList = ({ title, items, onAddItem }) => {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="budget-section">
      <h3>{title} <button className="add-button" onClick={onAddItem}>+</button></h3>
      <div className="budget-items">
        {items.map(item => (
          <BudgetItem key={item.id} item={item} />
        ))}
      </div>
      <div className="total">{total} грн</div>
    </div>
  );
};

export default BudgetList;