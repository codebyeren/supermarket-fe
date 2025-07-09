import React, { useEffect, useState } from 'react';
import LoadingSpinner from './index';
import './LoadingSpinner.css';
import { LoadingService } from '../../services/LoadingService';

const LoadingOverlay: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingService = LoadingService.getInstance();

  useEffect(() => {
    const unsubscribe = loadingService.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => unsubscribe();
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default LoadingOverlay; 