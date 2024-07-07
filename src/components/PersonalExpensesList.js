import React, { useState } from 'react';
import '../styles/PersonalExpensesList.css';

const PersonalExpensesList = React.memo(({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState({ description: '', amount: '' });

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && !isNaN(newExpense.amount)) {
      onAddExpense(newExpense.description, parseFloat(newExpense.amount));
      setNewExpense({ description: '', amount: '' });
    }
  };

  const handleUpdateExpense = (id) => {
    if (editingExpense.description && editingExpense.amount && !isNaN(editingExpense.amount)) {
      onUpdateExpense(id, editingExpense.description, parseFloat(editingExpense.amount));
      setEditingId(null);
      setEditingExpense({ description: '', amount: '' });
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense.PersonalExpensesId);
    setEditingExpense({ description: expense.Description, amount: expense.Amount.toString() });
  };

  return (
    <div className="personal-expenses-list">
      <h2>Личные расходы</h2>
      <div className="add-expense">
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          placeholder="Описание"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          placeholder="Сумма"
        />
        <button onClick={handleAddExpense}>Добавить</button>
      </div>
      <ul>
        {expenses.map(expense => (
          <li key={expense.PersonalExpensesId} className="expense-item">
            {editingId === expense.PersonalExpensesId ? (
              <>
                <input
                  type="text"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                />
                <input
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                />
                <button onClick={() => handleUpdateExpense(expense.PersonalExpensesId)}>Сохранить</button>
              </>
            ) : (
              <>
                <span className="expense-description">{expense.Description}</span>
                <span className="expense-amount">{expense.Amount} ₴</span>
                <div className="expense-actions">
                  <button onClick={() => startEditing(expense)}>Изменить</button>
                  <button onClick={() => onDeleteExpense(expense.PersonalExpensesId)}>Удалить</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PersonalExpensesList;