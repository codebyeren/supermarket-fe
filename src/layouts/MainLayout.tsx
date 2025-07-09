import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Headers from '../components/Header';
import Footer from '../components/Footer/Footer';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <div className='w-100'>
        <Headers />
      </div>
      <main>   
        {children || <Outlet />}
      </main>
      <div className='w-100'>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout; 