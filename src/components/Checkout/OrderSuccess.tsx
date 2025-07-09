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
    fullName: 'Nguyễn Văn A',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
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
      <h2 className={styles.successTitle}>Đặt hàng thành công!</h2>
      <p className={styles.successMessage}>
        Cảm ơn bạn đã đặt hàng tại Supermarket. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
      </p>
      <div className={styles.orderNumber}>
        Mã đơn hàng: <strong>#{orderId}</strong>
      </div>
      <p>
        Bạn sẽ nhận được email xác nhận đơn hàng trong vài phút tới. Vui lòng kiểm tra hộp thư của bạn.
      </p>
      
      <Space direction="vertical" size="middle" className={styles.actionButtons}>
        <Button
          icon={<FileTextOutlined />}
          onClick={showBillModal}
          size="large"
          className={styles.billButton}
        >
          Xem hóa đơn
        </Button>
        
        <Button
          type="primary"
          onClick={onComplete}
          size="large"
          className={styles.buttonContinue}
        >
          Tiếp tục mua sắm
        </Button>
      </Space>

      {/* Modal hiển thị hóa đơn */}
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