import React from 'react';
import { Button, Table, Typography } from 'antd';
import type { OrderItem, BillDetail } from '../../types';
import styles from './Checkout.module.css';

const { Title, Text } = Typography;

interface OrderSummaryProps {
  orderItems: OrderItem[];
  billDetails: BillDetail[];
  orderAmount: number;
  billAmount: number;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderItems,
  billDetails,
  orderAmount,
  billAmount,
  onNext,
  onBack,
  onCancel,
}) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string, record: OrderItem) => (
        <div className={styles.productCell}>
          <img
            src={`/public/img/${record.imageUrl}`}
            alt={record.productName}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <div className={styles.productName}>{record.productName}</div>
            {record.promotionDescription && (
              <div className={styles.promotionTag}>{record.promotionDescription}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: OrderItem) => {
        let finalPrice = record.price;
        if (record.discountPercent) {
          finalPrice = record.price * (1 - record.discountPercent / 100);
        } else if (record.discountAmount) {
          finalPrice = record.price - record.discountAmount;
        }
        return `$${(finalPrice * record.quantity).toFixed(2)}`;
      },
    },
  ];

  const billDetailItems = billDetails.map((detail, index) => (
    <div key={index} className={styles.billDetailRow}>
      <Text>{detail.description}</Text>
      <Text strong>${detail.amount.toFixed(2)}</Text>
    </div>
  ));

  return (
    <div className={styles.orderSummaryContainer}>
      <Title level={2} className={styles.sectionTitle}>
        Order Summary
      </Title>

      <Table
        dataSource={orderItems}
        columns={columns}
        rowKey="productId"
        pagination={false}
        className={styles.orderTable}
      />

      <div className={styles.billSummary}>
        <div className={styles.billDetailSection}>
          <Title level={4}>Payment Details</Title>
          {billDetailItems}
          <div className={styles.subtotalRow}>
            <Text>Subtotal:</Text>
            <Text strong>${orderAmount.toFixed(2)}</Text>
          </div>
          <div className={styles.totalRow}>
            <Text strong>Total Payment:</Text>
            <Text strong className={styles.totalAmount}>${billAmount.toFixed(2)}</Text>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onBack} className={styles.backButton}>
          Back
        </Button>
        <Button type="primary" onClick={onNext} className={styles.continueButton}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
