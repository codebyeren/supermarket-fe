import React from 'react';
import { Outlet } from 'react-router-dom';
import Headers from '../components/Header';
const MainLayout: React.FC = () => {
  return (
    
    <div className="main-layout">
  <div className='w-100'>
          <Headers />
      </div>
      <main>   
        <Outlet />
      </main>
      {/* You can add a Footer here */}
    </div>
  );
};

export default MainLayout; 