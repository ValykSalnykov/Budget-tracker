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

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const GeneralExpensesList = React.memo(({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [editingState, setEditingState] = useState({ id: null, description: '', amount: '' });
  const [isChanging, setIsChanging] = useState(false);
  const prevExpensesRef = useRef(expenses);

  useEffect(() => {
    if (JSON.stringify(prevExpensesRef.current) !== JSON.stringify(expenses)) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 300);
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

  const handleDeleteExpense = useCallback((id) => {
    onDeleteExpense(id);
  }, [onDeleteExpense]);

  const renderExpenseItem = useCallback((expense) => (
    <>
      <span className="flex-1 mr-2 font-medium">
        {editingState.id === expense.GeneralExpensesId ? (
          <input
            type="text"
            value={editingState.description}
            onChange={(e) => setEditingState(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
          />
        ) : (
          expense.Description
        )}
      </span>
      <span className="text-red-600 font-bold text-lg mr-2">
        {editingState.id === expense.GeneralExpensesId ? (
          <input
            type="number"
            value={editingState.amount}
            onChange={(e) => setEditingState(prev => ({ ...prev, amount: e.target.value }))}
            className="w-24 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
          />
        ) : (
          `${expense.Amount.toFixed()} ₴`
        )}
      </span>
      <div className="flex gap-2">
        {editingState.id === expense.GeneralExpensesId ? (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateExpense}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              <FaSave />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={cancelEditing}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              <FaTimes />
            </motion.button>
          </>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => startEditing(expense)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FaEdit />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDeleteExpense(expense.GeneralExpensesId)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          <FaTrash />
        </motion.button>
      </div>
    </>
  ), [editingState, handleUpdateExpense, cancelEditing, startEditing, handleDeleteExpense]);

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
      className="bg-white rounded-xl shadow-lg p-6 m-4 flex-auto transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Основные расходы</h2>
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Описание"
          className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Сумма"
          className="w-24 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddExpense}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          <FaPlus />
        </motion.button>
      </div>
      <div className="overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isChanging && (
            <motion.ul
              key={JSON.stringify(expenses)}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {expenses.map(expense => (
                <motion.li 
                  key={expense.GeneralExpensesId}
                  className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
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