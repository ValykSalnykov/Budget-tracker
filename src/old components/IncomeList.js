/**
 * @fileoverview Компонент для отображения и управления списком доходов.
 * @module IncomeList
 * @requires react
 * @requires framer-motion
 * @requires react-icons/fa
 *
 * @description
 * Этот компонент предоставляет интерфейс для добавления, редактирования и удаления записей о доходах.
 * Он также включает анимацию для различных действий, таких как добавление и удаление доходов.
 * 
 * @param {Object} props - Свойства компонента.
 * @param {Array} props.incomes - Список доходов.
 * @param {function} props.onAddIncome - Функция для добавления нового дохода.
 * @param {function} props.onUpdateIncome - Функция для обновления существующего дохода.
 * @param {function} props.onDeleteIncome - Функция для удаления дохода.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const IncomeList = React.memo(({ incomes, onAddIncome, onUpdateIncome, onDeleteIncome }) => {
  const [newIncome, setNewIncome] = useState('');
  const [editingState, setEditingState] = useState({ id: null, amount: '' });
  const [isChanging, setIsChanging] = useState(false);
  const prevIncomesRef = useRef(incomes);

  useEffect(() => {
    if (JSON.stringify(prevIncomesRef.current) !== JSON.stringify(incomes)) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 300);
      return () => clearTimeout(timer);
    }
    prevIncomesRef.current = incomes;
  }, [incomes]);

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

  const handleDeleteIncome = useCallback((id) => {
    onDeleteIncome(id);
  }, [onDeleteIncome]);

  const renderIncomeItem = useCallback((income) => (
    <>
      <span className="text-green-600 font-bold text-lg flex items-center">
        {editingState.id === income.IncomeId ? (
          <input
            type="number"
            value={editingState.amount}
            onChange={(e) => setEditingState(prev => ({ ...prev, amount: e.target.value }))}
            className="w-4/5 p-0 mr-0 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
          />
        ) : (
          `${income.Amount.toFixed()} ₴`
        )}
      </span>
      <div className="flex gap-2">
        {editingState.id === income.IncomeId ? (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateIncome}
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
            onClick={() => startEditing(income)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FaEdit />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDeleteIncome(income.IncomeId)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          <FaTrash />
        </motion.button>
      </div>
    </>
  ), [editingState, handleUpdateIncome, cancelEditing, startEditing, handleDeleteIncome]);

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
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Доходы</h2>
      <div className="flex mb-6">
        <input
          type="number"
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          placeholder="Сумма"
          className="flex-grow p-2 mr-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddIncome}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex-shrink-0"
        >
          <FaPlus />
        </motion.button>
      </div>
      <div className="overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isChanging && (
            <motion.ul
              key={JSON.stringify(incomes)}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {incomes.map(income => (
                <motion.li
                  key={income.IncomeId}
                  className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderIncomeItem(income)}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default IncomeList;