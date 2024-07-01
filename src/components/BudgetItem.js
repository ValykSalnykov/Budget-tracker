import React from 'react';

const BudgetItem = ({ item }) => {
  return (
    <div className="budget-item">
      <div className="item-amount">{item.amount} грн</div>
      <div className="item-name">{item.name}</div>
      <button className="edit-button">✏️</button>
      <button className="delete-button">🗑️</button>
    </div>);
};

export default BudgetItem;