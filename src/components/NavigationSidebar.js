import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Home, ChartSpline, PiggyBank, CreditCard, ChartPie, RefreshCcw, Settings, Sun, MoonStar, Database } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDBStatus } from '../hooks/useDBStatus';

const NavItem = ({ icon: Icon, label, expanded, onClick, isActive, children }) => {
  const { darkMode } = useTheme();
  return (
    <div>
      <div 
        className={`flex items-center p-2 cursor-pointer transition-all duration-100 hover:bg-white/10 
          ${isActive 
            ? darkMode 
              ? 'bg-white/20' 
              : 'bg-gray-200'
            : ''
          }`} 
        onClick={onClick}
      >
        <Icon size={24} className="flex-shrink-0"/>
        <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-100 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
};

const DatabaseStatusWithLabel = ({ expanded }) => {
  const connectionStatus = useDBStatus();

  const getStatusLabel = () => {
    switch(connectionStatus) {
      case 'connected': return 'Подключено';
      case 'disconnected': return 'Отключено';
      default: return '......';
    }
  };

  const getIconColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-yellow-400 animate-pulse';
    }
  };

  return (
    <div className="flex items-center p-2 transition-all duration-100">
      <Database size={24} className={`flex-shrink-0 ${getIconColor()}`} />
      <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-100 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
        {getStatusLabel()}
      </span>
    </div>
  );
};

const NavigationSidebar = ({ onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('Главная');
  const [menuWidth, setMenuWidth] = useState(0);
  const timeoutRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

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
    setMenuWidth(width + 70);
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
    }, 300);
  };

  const handleItemClick = (item) => {
    if (item.label === 'Настройки') {
      setSettingsExpanded(!settingsExpanded);
    } else {
      setActiveItem(item.label);
    }
  };

  return (
    <div 
      className={`h-3/6 fixed left-2 top-2 bottom-2 backdrop-blur-lg shadow-lg transition-all duration-100 ease-in-out rounded-lg ${
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
          >
            <div className={`overflow-hidden transition-all duration-100 ease-in-out ${settingsExpanded ? 'max-h-80' : 'max-h-0'}`}>
              {settingsNavItems.map((item, index) => (
                <NavItem key={index} {...item} expanded={expanded} onClick={item.onClick} />
              ))}
              <DatabaseStatusWithLabel expanded={expanded} />
            </div>
          </NavItem>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;