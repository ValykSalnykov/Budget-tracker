import React, { useState } from 'react';

const AddItemModal = ({ isOpen, onClose, onAdd, type }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, amount: parseFloat(amount), type });
    setName('');
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Добавить новый {type === 'income' ? 'доход' : 'расход'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Название:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Сумма:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Добавить</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;