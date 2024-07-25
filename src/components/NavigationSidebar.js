import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Home, ChartSpline, PiggyBank, CreditCard, ChartPie, RefreshCcw, Settings, Sun, MoonStar } from 'lucide-react';
import DatabaseStatus from './DatabaseStatus';

const NavItem = ({ icon: Icon, label, expanded, onClick, isActive, darkMode }) => {
  return (
    <div 
      className={`flex items-center p-2 cursor-pointer transition-all duration-300 hover:bg-white/10 
        ${isActive 
          ? darkMode 
            ? 'bg-white/20' 
            : 'bg-gray-200'
          : ''
        }`} 
      onClick={onClick}
    >
      <Icon size={24} className="flex-shrink-0"/>
      <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
        {label}
      </span>
    </div>
  );
};

const NavigationSidebar = ({ onExpand, darkMode, toggleDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('Главная');
  const [menuWidth, setMenuWidth] = useState(0);
  const timeoutRef = useRef(null);

  const mainNavItems = useMemo(() => [
    { icon: Home, label: 'Главная' },
    { icon: ChartSpline, label: 'Бюджет' },
    { icon: PiggyBank, label: 'Накопления' },
    { icon: CreditCard, label: 'Кредиты' },
    { icon: ChartPie, label: 'Аналитика' },
  ], []);

  const settingsNavItems = useMemo(() => [
    { icon: RefreshCcw, label: 'Обновить', onClick: () => console.log('Обновить данные') },
    { icon: darkMode ? Sun : MoonStar, label: darkMode ? 'Светлая тема' : 'Темная тема', onClick: toggleDarkMode },
  ], [darkMode, toggleDarkMode]);

  const allItems = useMemo(() => [...mainNavItems, ...settingsNavItems, { label: 'Настройки' }, { label: 'База данных' }], [mainNavItems, settingsNavItems]);

  useEffect(() => {
    const longestLabel = allItems.reduce((max, item) => 
      item.label.length > max.length ? item.label : max, '');
    const tempElement = document.createElement('span');
    tempElement.style.visibility = 'hidden';
    tempElement.style.position = 'absolute';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.innerText = longestLabel;
    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth;
    document.body.removeChild(tempElement);
    setMenuWidth(width + 70); // 24px for icon, 8px for left padding, 8px for right padding, 30px buffer
  }, [allItems]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setExpanded(true);
    onExpand(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setExpanded(false);
      setSettingsExpanded(false);
      onExpand(false);
    }, 300); // Добавляем небольшую задержку перед сворачиванием
  };

  const handleItemClick = (item) => {
    if (item.label === 'Настройки') {
      setSettingsExpanded(!settingsExpanded);
    } else {
      setActiveItem(item.label);
    }
    // Удаляем код, который сворачивал меню при клике
  };

  return (
    <div 
      className={`h-3/6 fixed left-2 top-2 bottom-2 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out rounded-lg ${
        darkMode 
          ? 'bg-gray-800/30 text-white' 
          : 'bg-white/30 text-gray-900'
      } ${
        expanded ? `w-[${menuWidth}px]` : 'w-10'
      }`}
      style={{
        boxShadow: darkMode 
          ? '0 4px 30px rgba(0, 0, 0, 0.1)'
          : '0 4px 30px rgba(255, 255, 255, 0.1)',
        border: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="py-2 h-full flex flex-col justify-between">
        <div>
          {mainNavItems.map((item, index) => (
            <NavItem 
              key={index} 
              {...item} 
              expanded={expanded} 
              onClick={() => handleItemClick(item)} 
              isActive={activeItem === item.label}
              darkMode={darkMode}
            />
          ))}
        </div>
        <div>
          <NavItem 
            icon={Settings} 
            label="Настройки" 
            expanded={expanded} 
            onClick={() => handleItemClick({label: 'Настройки'})}
            isActive={settingsExpanded}
            darkMode={darkMode}
          />
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${settingsExpanded ? 'max-h-40' : 'max-h-0'}`}>
            {settingsNavItems.map((item, index) => (
              <NavItem key={index} {...item} expanded={expanded} onClick={item.onClick} darkMode={darkMode} />
            ))}
            <DatabaseStatusWithLabel expanded={expanded} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DatabaseStatusWithLabel = ({ expanded }) => {
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/.netlify/functions/db-status');
        const data = await response.json();
        setConnectionStatus(data.status);
      } catch (error) {
        console.error('Ошибка при проверке статуса базы данных:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const getStatusLabel = () => {
    switch(connectionStatus) {
      case 'connected': return 'Подключено';
      case 'disconnected': return 'Отключено';
      default: return 'Подключение...';
    }
  };

  return (
    <div className="flex items-center p-2 transition-all duration-300">
      <DatabaseStatus />
      <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
        {getStatusLabel()}
      </span>
    </div>
  );
};

export default NavigationSidebar;