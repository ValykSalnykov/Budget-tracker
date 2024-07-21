import React, { useState, useRef } from 'react';
import { Home, Settings, Mail, User } from 'lucide-react';

const NavItem = ({ icon: Icon, label, expanded, onClick }) => {
  return (
    <div className="flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-white/10" onClick={onClick}>
      <Icon size={24} className="flex-shrink-0"/>
      <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
        {label}
      </span>
    </div>
  );
};

const NavigationSidebar = ({ onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setExpanded(true);
      onExpand(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setExpanded(false);
    onExpand(false);
  };

  const handleItemClick = (item) => {
    clearTimeout(timeoutRef.current);
    setExpanded(false);
    onExpand(false);
    // Здесь можно добавить логику для обработки кликов по пунктам меню
  };

  const navItems = [
    { icon: Home, label: 'Главная' },
    { icon: Mail, label: 'Сообщения' },
    { icon: User, label: 'Профиль' },
    { icon: Settings, label: 'Настройки' },
  ];

  return (
    <div 
      className={`fixed left-2 top-2 bottom-2 bg-white/5 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out rounded-lg ${expanded ? 'w-36' : 'w-10'}`}
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="py-2 h-full flex flex-col justify-between">
        <div>
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} expanded={expanded} onClick={() => handleItemClick(item)} />
          ))}
        </div>
        {/* Можно добавить дополнительный контент внизу, если нужно */}
        <div className="p-2">
          {/* Например, версия приложения или кнопка выхода */}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;