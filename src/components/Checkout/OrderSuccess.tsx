import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import styles from './Checkout.module.css';
import BillModal from '../Bill/BillModal';
import type { OrderItem, BillDetail } from '../../types';

interface OrderSuccessProps {
  orderId: number;
  onComplete: () => void;
  orderItems?: OrderItem[];
  billDetails?: BillDetail[];
  orderAmount?: number;
  billAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  customerInfo?: {
    fullName: string;
    address: string;
    phone: string;
  };
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ 
  orderId, 
  onComplete,
  orderItems = [],
  billDetails = [],
  orderAmount = 0,
  billAmount = 0,
  paymentMethod = 'CASH',
  paymentStatus = 'PENDING',
  customerInfo = {
    fullName: 'John Doe',
    address: '123 Le Loi Street, District 1, Ho Chi Minh City',
    phone: '0987654321'
  }
}) => {
  const [billModalVisible, setBillModalVisible] = useState(false);

  const showBillModal = () => {
    setBillModalVisible(true);
  };

  const handleCloseBillModal = () => {
    setBillModalVisible(false);
  };

  return (
    <div className={styles.orderSuccessContainer}>
      <div className={styles.successIcon}>✅</div>
      <h2 className={styles.successTitle}>Order placed successfully!</h2>
      <p className={styles.successMessage}>
        Thank you for your order at Supermarket. We will process your order as soon as possible.
      </p>
      <div className={styles.orderNumber}>
        Order ID: <strong>#{orderId}</strong>
      </div>
      <p>
        You will receive an order confirmation email within a few minutes. Please check your inbox.
      </p>
      
      <Space direction="vertical" size="middle" className={styles.actionButtons}>
        <Button
          icon={<FileTextOutlined />}
          onClick={showBillModal}
          size="large"
          className={styles.billButton}
        >
          View Invoice
        </Button>
        
        <Button
          type="primary"
          onClick={onComplete}
          size="large"
          className={styles.buttonContinue}
        >
          Continue Shopping
        </Button>
      </Space>

      <BillModal 
        visible={billModalVisible}
        onClose={handleCloseBillModal}
        orderId={orderId}
        dateOfPurchase={new Date().toISOString()}
        customerInfo={customerInfo}
        orderItems={orderItems}
        billDetails={billDetails}
        orderAmount={orderAmount}
        billAmount={billAmount}
        paymentMethod={paymentMethod}
        paymentStatus={paymentStatus}
      />
    </div>
  );
};

export default OrderSuccess;