import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      {/* You can add a Navbar or Header here that will be shared across the main pages */}
      <main>
        <Outlet />
      </main>
      {/* You can add a Footer here */}
    </div>
  );
};

export default MainLayout; 