import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import BillInvoice from './BillInvoice';
import type { OrderItem, BillDetail } from '../../types';
import './BillModal.css';

interface BillModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: number;
  dateOfPurchase?: string;
  customerInfo: {
    fullName: string;
    address: string;
    phone: string;
  };
  orderItems: OrderItem[];
  billDetails: BillDetail[];
  orderAmount: number;
  billAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const BillModal: React.FC<BillModalProps> = ({
  visible,
  onClose,
  orderId,
  dateOfPurchase,
  customerInfo, 
  orderItems,
  billDetails,
  orderAmount,
  billAmount,
  paymentMethod,
  paymentStatus,
}) => {
  // Tạo ref cho component BillInvoice để in
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Cấu hình chức năng in
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,               // ✅ Dùng contentRef thay vì content
    documentTitle: `Hóa đơn #${orderId}`,
  });
  

  return (
   <Modal
      open={visible}
      title="Purchase Invoice"
      onCancel={onClose}
      width={800}
      centered
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Print Invoice
        </Button>,
      ]}
      className="bill-modal"
    >
      <div className="bill-container">
        <BillInvoice
          ref={invoiceRef}
          orderId={orderId}
          dateOfPurchase={dateOfPurchase || new Date().toISOString()}
          customerInfo={customerInfo}
          orderItems={orderItems}
          billDetails={billDetails}
          orderAmount={orderAmount}
          billAmount={billAmount}
          paymentMethod={paymentMethod}
          paymentStatus={paymentStatus}
        />
      </div>
    </Modal>
  );
};

export default BillModal; 