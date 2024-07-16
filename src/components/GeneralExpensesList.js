/**
 * @fileoverview Компонент для отображения и управления списком основных расходов.
 * @module GeneralExpensesList
 * @requires react
 * @requires framer-motion
 * @requires react-icons/fa
 * @requires ../styles/GeneralExpensesList.css
 *
 * @description
 * Этот компонент предоставляет интерфейс для добавления, редактирования и удаления записей об основных расходах.
 * Он также включает анимацию для различных действий, таких как добавление и удаление расходов.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {Array} props.expenses - Список расходов.
 * @param {function} props.onAddExpense - Функция для добавления нового расхода.
 * @param {function} props.onUpdateExpense - Функция для обновления существующего расхода.
 * @param {function} props.onDeleteExpense - Функция для удаления расхода.
 */

import React, { useState, useCallback, useRef, useEffect  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/GeneralExpensesList.css';

const GeneralExpensesList = React.memo(({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [editingState, setEditingState] = useState({ id: null, description: '', amount: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const deleteTimerRef = useRef(null);
  const [isChanging, setIsChanging] = useState(false);
  const prevExpensesRef = useRef(expenses);


  useEffect(() => {
    if (JSON.stringify(prevExpensesRef.current) !== JSON.stringify(expenses)) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 300); // Adjust timing as needed
      return () => clearTimeout(timer);
    }
    prevExpensesRef.current = expenses;
  }, [expenses]);

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
      id: expense.GeneralExpensesId,
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
        {editingState.id === expense.GeneralExpensesId ? (
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
        {editingState.id === expense.GeneralExpensesId ? (
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
        {editingState.id === expense.GeneralExpensesId ? (
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
          {deletingId === expense.GeneralExpensesId ? (
            <motion.button
              key="confirm"
              className="delete-button confirming"
              whileTap={{ scale: 0.97 }}
              initial={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}
              animate={{ width: '100%', backgroundColor: '#ff4d4d' }}
              exit={{ width: 0, height: '100%', backgroundColor: 'var(--primary-color)', zIndex: '1' }}
              transition={{ duration: 0.2, ease: 'linear' }}
              onClick={() => handleDeleteClick(expense.GeneralExpensesId)}
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
              onClick={() => handleDeleteClick(expense.GeneralExpensesId)}
            >
              <FaTrash />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  ), [editingState, handleUpdateExpense, cancelEditing, deletingId, handleDeleteClick, cancelDeleting, startEditing, isReturning]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <motion.div 
      className="general-expenses-list"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2>Основные расходы</h2>
      <div className="add-expense">
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Описание"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Сумма"
        />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddExpense}>
          <FaPlus />
        </motion.button>
      </div>
      <div className="general-expenses-list-container">
        <AnimatePresence mode="wait">
          {!isChanging && (
            <motion.ul
              key={JSON.stringify(expenses)}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {expenses.map(expense => (
                <motion.li
                key={expense.GeneralExpensesId}
                className="expense-item"
                //variants={itemVariants}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                >
                  {renderExpenseItem(expense)}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default GeneralExpensesList;