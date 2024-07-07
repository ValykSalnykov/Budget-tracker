import React, { useState } from 'react';
import '../styles/IncomeList.css';

const IncomeList = React.memo(({ incomes, onAddIncome, onUpdateIncome, onDeleteIncome }) => {
  const [newIncome, setNewIncome] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingAmount, setEditingAmount] = useState('');

  const handleAddIncome = () => {
    if (newIncome && !isNaN(newIncome)) {
      onAddIncome(parseFloat(newIncome));
      setNewIncome('');
    }
  };

  const handleUpdateIncome = (id) => {
    if (editingAmount && !isNaN(editingAmount)) {
      onUpdateIncome(id, parseFloat(editingAmount));
      setEditingId(null);
      setEditingAmount('');
    }
  };

  const startEditing = (income) => {
    setEditingId(income.IncomeId);
    setEditingAmount(income.Amount.toString());
  };

  return (
    <div className="income-list">
      <h2>Доходы</h2>
      <div className="add-income">
        <input
          type="number"
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          placeholder="Сумма дохода"
        />
        <button onClick={handleAddIncome}>Добавить</button>
      </div>
      <ul>
        {incomes.map(income => (
          <li key={income.IncomeId} className="income-item">
            {editingId === income.IncomeId ? (
              <>
                <input
                  type="number"
                  value={editingAmount}
                  onChange={(e) => setEditingAmount(e.target.value)}
                />
                <button onClick={() => handleUpdateIncome(income.IncomeId)}>Сохранить</button>
              </>
            ) : (
              <>
                <span className="income-amount">{income.Amount} ₴</span>
                <div className="income-actions">
                  <button onClick={() => startEditing(income)}>Изменить</button>
                  <button onClick={() => onDeleteIncome(income.IncomeId)}>Удалить</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default IncomeList;