import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/IncomeList.css';

const IncomeList = React.memo(({ incomes, onAddIncome, onUpdateIncome, onDeleteIncome }) => {
  const [newIncome, setNewIncome] = useState('');
  const [editingState, setEditingState] = useState({ id: null, amount: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const deleteTimerRef = useRef(null);

  const handleAddIncome = useCallback(() => {
    const amount = parseFloat(newIncome);
    if (amount && !isNaN(amount)) {
      onAddIncome(amount);
      setNewIncome('');
    }
  }, [newIncome, onAddIncome]);

  const handleUpdateIncome = useCallback(() => {
    const amount = parseFloat(editingState.amount);
    if (amount && !isNaN(amount)) {
      onUpdateIncome(editingState.id, amount);
      setEditingState({ id: null, amount: '' });
    }
  }, [editingState, onUpdateIncome]);

  const startEditing = useCallback((income) => {
    setEditingState({ id: income.IncomeId, amount: income.Amount.toString() });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingState({ id: null, amount: '' });
  }, []);

  const handleDeleteClick = useCallback((id) => {
    if (deletingId === id) {
      onDeleteIncome(id);
      setDeletingId(null);
      clearTimeout(deleteTimerRef.current);
    } else {
      clearTimeout(deleteTimerRef.current);
      setDeletingId(id);
    }
  }, [deletingId, onDeleteIncome]);

  const cancelDeleting = useCallback(() => {
    setIsReturning(true);
    deleteTimerRef.current = setTimeout(() => {
      setDeletingId(null);
      setIsReturning(false);
    }, 2000);
  }, []);

  const renderEditingForm = useCallback((income) => (
    <div className="editing-container">
      <input
        type="number"
        value={editingState.amount}
        onChange={(e) => setEditingState(prev => ({ ...prev, amount: e.target.value }))}
      />
      <motion.button whileTap={{ scale: 0.95 }} onClick={handleUpdateIncome}>
        <FaSave />
      </motion.button>
      <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEditing}>
        <FaTimes />
      </motion.button>
    </div>
  ), [editingState, handleUpdateIncome, cancelEditing]);

  const renderIncomeItem = useCallback((income) => (
    <>
      <span className="income-amount">{income.Amount.toFixed()} ₴</span>
      <div className="income-actions">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => startEditing(income)}>
          <FaEdit />
        </motion.button>
        <AnimatePresence>
          {deletingId === income.IncomeId ? (
            <motion.button
              key="confirm"
              className="delete-button confirming"
              initial={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}
              animate={{
                width: '100%',
                backgroundColor: '#ff4d4d',
              }}
              exit={{
                width: 'auto',
                backgroundColor: 'var(--primary-color)',
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleDeleteClick(income.IncomeId)}
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
              transition={{ duration: 0.3 }}
              onClick={() => handleDeleteClick(income.IncomeId)}
            >
              <FaTrash />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  ), [deletingId, handleDeleteClick, cancelDeleting, startEditing, isReturning]);

  return (
    <motion.div 
      className="income-list"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2>Доходы</h2>
      <div className="add-income">
        <input
          type="number"
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          placeholder="Сумма дохода"
        />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddIncome}>
          <FaPlus />
        </motion.button>
      </div>
      <ul>
        <AnimatePresence>
          {incomes.map(income => (
            <motion.li
              key={income.IncomeId}
              className="income-item"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {editingState.id === income.IncomeId 
                ? renderEditingForm(income)
                : renderIncomeItem(income)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
});

export default IncomeList;