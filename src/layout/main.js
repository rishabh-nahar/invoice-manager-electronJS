import React, { useState } from 'react';
import Sidebar from '../components/sidebar';


const MainLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="main-layout">
        <div className='sidebar-container'>
            <Sidebar isOpen={isSidebarOpen} />
        </div>
        <div className='outlet-container'>
            {children}
        </div>
    </div>
  );
};

export default MainLayout;
