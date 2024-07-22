import React from 'react';

const HomePage = () => {
  return (
    <div 
      className="m-2 bg-white/5 backdrop-blur-lg rounded-lg overflow-auto"
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: 'calc(100vh - 1rem)',
      }}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Добро пожаловать на домашнюю страницу</h1>
        <p className="text-black/80">Это пример содержимого домашней страницы. Вы можете добавить здесь любую информацию или компоненты.</p>
      </div>
    </div>
  );
};

export default HomePage;