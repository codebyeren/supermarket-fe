import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Authentication logic will be implemented here
  return <>{children}</>;
};

export default ProtectedRoute; 