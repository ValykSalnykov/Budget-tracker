import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/PersonalExpensesList.css';

const PersonalExpensesList = React.memo(({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [editingState, setEditingState] = useState({ id: null, description: '', amount: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const deleteTimerRef = useRef(null);

  const handleAddExpense = useCallback(() => {
    const amount = parseFloat(newExpense.amount);
    if (newExpense.description && amount && !isNaN(amount)) {
      onAddExpense(newExpense.description, amount);
      setNewExpense({ description: '', amount: '' });
    }
  }, [newExpense, onAddExpense]);

  const handleUpdateExpense = useCallback(() => {
    const amount = parseFloat(editingState.amount);
    if (editingState.description && amount && !isNaN(amount)) {
      onUpdateExpense(editingState.id, editingState.description, amount);
      setEditingState({ id: null, description: '', amount: '' });
    }
  }, [editingState, onUpdateExpense]);

  const startEditing = useCallback((expense) => {
    setEditingState({
      id: expense.PersonalExpensesId,
      description: expense.Description,
      amount: expense.Amount.toString()
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingState({ id: null, description: '', amount: '' });
  }, []);

  const handleDeleteClick = useCallback((id) => {
    if (deletingId === id) {
      onDeleteExpense(id);
      setDeletingId(null);
      clearTimeout(deleteTimerRef.current);
    } else {
      clearTimeout(deleteTimerRef.current);
      setDeletingId(id);
    }
  }, [deletingId, onDeleteExpense]);

  const cancelDeleting = useCallback(() => {
    setIsReturning(true);
    deleteTimerRef.current = setTimeout(() => {
      setDeletingId(null);
      setIsReturning(false);
    }, 2000);
  }, []);

  const renderExpenseItem = useCallback((expense) => (
    <>
      <span className="expense-description">
        {editingState.id === expense.PersonalExpensesId ? (
          <input
            type="text"
            value={editingState.description}
            onChange={(e) => setEditingState(prev => ({ ...prev, description: e.target.value }))}
            className="editing-input"
          />
        ) : (
          expense.Description
        )}
      </span>
      <span className="expense-amount">
        {editingState.id === expense.PersonalExpensesId ? (
          <input
            type="number"
            value={editingState.amount}
            onChange={(e) => setEditingState(prev => ({ ...prev, amount: e.target.value }))}
            className="editing-input"
          />
        ) : (
          `${expense.Amount.toFixed()} ₴`
        )}
      </span>
      <div className="expense-actions">
        {editingState.id === expense.PersonalExpensesId ? (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleUpdateExpense}>
              <FaSave />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEditing}>
              <FaTimes />
            </motion.button>
          </>
        ) : (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => startEditing(expense)}>
            <FaEdit />
          </motion.button>
        )}
        <AnimatePresence>
          {deletingId === expense.PersonalExpensesId ? (
            <motion.button
              key="confirm"
              className="delete-button confirming"
              whileTap={{ scale: 0.97 }}
              initial={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}
              animate={{ width: '100%', backgroundColor: '#ff4d4d' }}
              exit={{ width: 0, height: '100%', backgroundColor: 'var(--primary-color)', zIndex: '1' }}
              transition={{ duration: 0.2, ease: 'linear' }}
              onClick={() => handleDeleteClick(expense.PersonalExpensesId)}
              onMouseLeave={cancelDeleting}
              onMouseEnter={() => clearTimeout(deleteTimerRef.current)}
            >
              Вы уверены?
            </motion.button>
          ) : (
            <motion.button
              key="delete"
              className="delete-button"
              initial={isReturning ? { width: '100%', backgroundColor: '#ff4d4d' } : {}}
              animate={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}
              transition={{ duration: 0.85 }}
              onClick={() => handleDeleteClick(expense.PersonalExpensesId)}
            >
              <FaTrash />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  ), [editingState, handleUpdateExpense, cancelEditing, deletingId, handleDeleteClick, cancelDeleting, startEditing, isReturning]);

  return (
    <motion.div 
      className="personal-expenses-list"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Личные расходы</h2>
      <div className="add-expense">
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Описание расхода"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Сумма расхода"
        />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddExpense}>
          <FaPlus />
        </motion.button>
      </div>
      <ul>
        <AnimatePresence>
          {expenses.map(expense => (
            <motion.li
              key={expense.PersonalExpensesId}
              className="expense-item"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.75 }}
            >
              {renderExpenseItem(expense)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
});

export default PersonalExpensesList;