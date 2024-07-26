import React, { useState } from 'react';
import NavigationSidebar from './NavigationSidebar';
import Background from './Background';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { darkMode } = useTheme();

    const handleSidebarExpand = (expanded) => {
        setSidebarExpanded(expanded);
    };

    return (
        <div className="min-h-screen flex text-gray-900">
            <Background opacity={0.5} darkMode={darkMode} />
            <NavigationSidebar onExpand={handleSidebarExpand} />
            <div className={`flex-grow transition-all duration-100 ${sidebarExpanded ? 'ml-40' : 'ml-14'}`}>
                {children}
            </div>
        </div>
    );
}

export default Layout;