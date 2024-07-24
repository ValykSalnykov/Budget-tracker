import React, {useState, useEffect } from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import HomePage from './components/HomePage';
import AnimatedBackground from './components/AnimatedBackground';

const App = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleSidebarExpand = (expanded) => {
        setSidebarExpanded(expanded);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen flex text-gray-900">
            <AnimatedBackground opacity={0.5} darkMode={darkMode} />
            <NavigationSidebar onExpand={handleSidebarExpand} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <div className={`flex-grow transition-all duration-100 ${sidebarExpanded ? 'ml-40' : 'ml-14'}`}>
                <HomePage darkMode={darkMode} />
            </div>
        </div>
    );
}

export default App;


// Прошлый код реализации приложения альфа версии
/* import DatabaseStatus from './components/DatabaseStatus';
const App = () => {
  const [isLoading, setIsLoading] = useState({ months: true, weeks: false });
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, errorMessage) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DatabaseStatus />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
      </div>
    </div>
  );
} */
