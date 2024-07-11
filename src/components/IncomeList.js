import React, { useState, useCallback, useRef, useEffect  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/IncomeList.css';

const IncomeList = React.memo(({ incomes, onAddIncome, onUpdateIncome, onDeleteIncome }) => {
  const [newIncome, setNewIncome] = useState('');
  const [editingState, setEditingState] = useState({ id: null, amount: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const deleteTimerRef = useRef(null);
  const [isChanging, setIsChanging] = useState(false);
  const prevIncomesRef = useRef(incomes);

  useEffect(() => {
    if (JSON.stringify(prevIncomesRef.current) !== JSON.stringify(incomes)) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 300); // Adjust timing as needed
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

  const renderIncomeItem = useCallback((income) => (
    <>
      <span className="income-amount">
        {editingState.id === income.IncomeId ? (
          <input
            type="number"
            value={editingState.amount}
            onChange={(e) => setEditingState(prev => ({ ...prev, amount: e.target.value }))}
            className="editing-input"
          />
        ) : (
          `${income.Amount.toFixed()} ₴`
        )}
      </span>
      <div className="income-actions">
        {editingState.id === income.IncomeId ? (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleUpdateIncome}>
              <FaSave />
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEditing}>
              <FaTimes />
            </motion.button>
          </>
        ) : (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => startEditing(income)}>
            <FaEdit />
          </motion.button>
        )}
        <AnimatePresence>
          {deletingId === income.IncomeId ? (
            <motion.button
              key="confirm"
              className="delete-button confirming"
              whileTap={{ scale: 0.97 }}
              initial={{ width: 'auto', backgroundColor: 'var(--primary-color)' }}
              animate={{ width: '100%', backgroundColor: '#ff4d4d' }}
              exit={{ width: 0, height: '100%', backgroundColor: 'var(--primary-color)', zIndex: '1' }}
              transition={{ duration: 0.2, ease: 'linear' }}
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
              transition={{ duration: 0.85 }}
              onClick={() => handleDeleteClick(income.IncomeId)}
            >
              <FaTrash />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  ), [editingState, handleUpdateIncome, cancelEditing, deletingId, handleDeleteClick, cancelDeleting, startEditing, isReturning]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      className="income-list"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2>Доходы</h2>
      <div className="add-income">
        <input
          type="number"
          value={newIncome}
          onChange={(e) => setNewIncome(e.target.value)}
          placeholder="Сумма"
        />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddIncome}>
          <FaPlus />
        </motion.button>
      </div>
      <div className="income-list-container">
        <AnimatePresence mode="wait">
          {!isChanging && (
            <motion.ul
              key={JSON.stringify(incomes)}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {incomes.map(income => (
                <motion.li 
                  key={income.IncomeId}
                  className="income-item"
                  //variants={itemVariants}
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