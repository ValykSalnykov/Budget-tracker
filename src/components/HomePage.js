import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const { darkMode } = useTheme();

  return (
    <div 
      className={`h-5/6 m-2 backdrop-blur-lg shadow-lg transition-all duration-100 rounded-lg overflow-auto ${
        darkMode 
          ? 'bg-gray-800/30 text-white' 
          : 'bg-white/30 text-gray-900'
      }`}
      style={{
        boxShadow: darkMode 
          ? '0 4px 30px rgba(0, 0, 0, 0.1)'
          : '0 4px 30px rgba(255, 255, 255, 0.1)',
        border: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Добро пожаловать на домашнюю страницу
        </h1>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
          Это пример содержимого домашней страницы. Вы можете добавить здесь любую информацию или компоненты.
        </p>
      </div>
    </div>
  );
};

export default HomePage;