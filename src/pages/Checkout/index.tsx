import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutComponent from '../../components/Checkout';
import LoadingOverlay from '../../components/LoadingSpinner/LoadingOverlay';
import './Checkout.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/cart');
  };

  return (
      <div className="checkout-page-container">
        <CheckoutComponent onCancel={handleCancel} />
        <LoadingOverlay />
      </div>
  );
};

export default CheckoutPage; 