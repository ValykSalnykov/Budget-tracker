import React, { useState, useEffect } from 'react';
import { fetchBudgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem } from '../api';
import { Tooltip } from 'react-tooltip';
import { PieChart, Pie, Cell } from 'recharts';
import WeekSelector from './WeekSelector';
import BudgetList from './BudgetList';
import AddItemModal from './AddItemModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BudgetView = ({ monthData, onAddItem }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addItemType, setAddItemType] = useState('');

  useEffect(() => {
    const targetBalance = monthData.weeks[selectedWeek].weekBalance;
    const duration = 1000;
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    const increment = targetBalance / totalFrames;

    let currentFrame = 0;
    const timer = setInterval(() => {
      if (currentFrame < totalFrames) {
        setAnimatedBalance(prev => Math.min(prev + increment, targetBalance));
        currentFrame++;
      } else {
        clearInterval(timer);
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [selectedWeek, monthData]);

  const openAddModal = (type) => {
    setAddItemType(type);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const addNewItem = (newItem) => {
    onAddItem(newItem, selectedWeek);
    closeAddModal();
  };

  const weekData = monthData.weeks[selectedWeek];
  const pieData = [
    { name: 'Доходы', value: weekData.income.reduce((sum, item) => sum + item.amount, 0) },
    { name: 'Основные расходы', value: weekData.mainExpenses.reduce((sum, item) => sum + item.amount, 0) },
    { name: 'Личные расходы', value: weekData.personalExpenses.reduce((sum, item) => sum + item.amount, 0) },
  ];

  return (
    <div className="budget-view">
      <div className="header">
        <button className="update-button" data-tooltip-id="update-tooltip" data-tooltip-content="Обновить данные бюджета">Обновить данные</button>
        <Tooltip id="update-tooltip" />
        <h2>{monthData.month}</h2>
        <div className="balance">
          <div>Остаток недели: <span className="amount">{animatedBalance.toFixed(2)} грн</span></div>
          <div>Остаток месяца: <span className="amount">{monthData.monthBalance} грн</span></div>
        </div>
      </div>
      <WeekSelector weeks={monthData.weeks} selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
      <div className="budget-summary">
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            cx={100}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="legend">
          {pieData.map((entry, index) => (
            <div key={`legend-${index}`} className="legend-item">
              <span className="legend-color" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
              <span>{entry.name}: {entry.value} грн</span>
            </div>
          ))}
        </div>
      </div>
      <div className="budget-sections">
        <BudgetList title="Доходы" items={weekData.income} onAddItem={() => openAddModal('income')} />
        <BudgetList title="Основные расходы" items={weekData.mainExpenses} onAddItem={() => openAddModal('mainExpenses')} />
        <BudgetList title="Личные расходы" items={weekData.personalExpenses} onAddItem={() => openAddModal('personalExpenses')} />
      </div>
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={addNewItem}
        type={addItemType}
      />
    </div>
  );
};

// const BudgetView = () => {
//   const [budgetItems, setBudgetItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadBudgetItems();
//   }, []);

//   async function loadBudgetItems() {
//     try {
//       setLoading(true);
//       const items = await fetchBudgetItems();
//       setBudgetItems(items);
//       setError(null);
//     } catch (err) {
//       setError('Не удалось загрузить бюджетные записи');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleAddItem(newItem) {
//     try {
//       const createdItem = await createBudgetItem(newItem);
//       setBudgetItems([...budgetItems, createdItem]);
//     } catch (err) {
//       setError('Не удалось добавить бюджетную запись');
//     }
//   }

//   async function handleUpdateItem(id, updatedItem) {
//     try {
//       const updated = await updateBudgetItem(id, updatedItem);
//       setBudgetItems(budgetItems.map(item => item.id === id ? updated : item));
//     } catch (err) {
//       setError('Не удалось обновить бюджетную запись');
//     }
//   }

//   async function handleDeleteItem(id) {
//     try {
//       await deleteBudgetItem(id);
//       setBudgetItems(budgetItems.filter(item => item.id !== id));
//     } catch (err) {
//       setError('Не удалось удалить бюджетную запись');
//     }
//   }

//   if (loading) return <div>Загрузка...</div>;
//   if (error) return <div>Ошибка: {error}</div>;

//   return (
//     <div>
//       {/* Здесь добавьте компоненты для отображения и взаимодействия с бюджетными записями */}
//     </div>
//   );
// };

export default BudgetView;