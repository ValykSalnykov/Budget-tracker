import React, {useState} from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import HomePage from './components/HomePage';
import AnimatedCloudBackground from './components/AnimatedCloudBackground';
// import MonthCarousel from './components/MonthCarousel';
// import WeekSelector from './components/WeekSelector';
// import DatabaseStatus from './components/DatabaseStatus';
// import BudgetList from './components/BudgetList';
// const App = () => {
//   const [months, setMonths] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [weeks, setWeeks] = useState([]);
//   const [selectedWeek, setSelectedWeek] = useState(null);
//   const [isLoading, setIsLoading] = useState({ months: true, weeks: false });
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async (url, errorMessage) => {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(errorMessage);
//     }
//     return response.json();
//   }, []);

//   const fetchMonths = useCallback(async () => {
//     try {
//       const data = await fetchData('/.netlify/functions/get-months', 'Не удалось получить данные о месяцах');
//       setMonths(data);
//       const currentMonth = new Date().getMonth() + 1;
//       const currentMonthData = data.find(month => month.monthNumber === currentMonth) || data[0];
//       setSelectedMonth(currentMonthData?.MonthId);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(prev => ({ ...prev, months: false }));
//     }
//   }, [fetchData]);

//   const fetchWeeks = useCallback(async (monthId) => {
//     if (!monthId) return;
//     setIsLoading(prev => ({ ...prev, weeks: true }));
//     try {
//       const data = await fetchData(`/.netlify/functions/get-weeks?monthId=${monthId}`, 'Не удалось получить данные о неделях');
//       setWeeks(data);
//       setSelectedWeek(null);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(prev => ({ ...prev, weeks: false }));
//     }
//   }, [fetchData]);

//   useEffect(() => {
//     fetchMonths();
//   }, [fetchMonths]);

//   useEffect(() => {
//     if (selectedMonth) {
//       fetchWeeks(selectedMonth);
//     }
//   }, [selectedMonth, fetchWeeks]);

//   const handleMonthSelect = useCallback((monthId) => {
//     setSelectedMonth(monthId);
//     setSelectedWeek(null);
//   }, []);

//   const handleWeekSelect = useCallback((weekIndex) => {
//     setSelectedWeek(weekIndex);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <DatabaseStatus />
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//             <p>{error}</p>
//           </div>
//         )}
//         {isLoading.months ? (
//           <div className="text-center py-4">
//             <p className="text-lg">Загрузка месяцев...</p>
//           </div>
//         ) : (
//           months.length > 0 && (
//             <MonthCarousel
//               months={months}
//               selectedMonth={selectedMonth}
//               onSelectMonth={handleMonthSelect}
//             />
//           )
//         )}
//         <WeekSelector
//           weeks={weeks}
//           selectedWeek={selectedWeek}
//           onSelectWeek={handleWeekSelect}
//           isLoading={isLoading.weeks}
//         />
//         {weeks.length > 0 && selectedWeek !== null && (
//           <BudgetList selectedWeek={selectedWeek} weeks={weeks} selectedMonth={selectedMonth} />
//         )}
//       </div>
//     </div>
//   );
// }

const App = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const handleSidebarExpand = (expanded) => {
        setSidebarExpanded(expanded);
    };

    return (
        <div className="min-h-screen flex">
            <AnimatedCloudBackground />
            <NavigationSidebar onExpand={handleSidebarExpand} />
            <div className={`flex-grow transition-all duration-300 ${sidebarExpanded ? 'ml-40' : 'ml-14'}`}>
                <HomePage />
            </div>
        </div>
    );
}

export default App;