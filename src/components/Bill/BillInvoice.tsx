import React, { forwardRef } from 'react';
import { Typography, Divider } from 'antd';
import type { OrderItem, BillDetail } from '../../types';
import { multiplyDecimals, formatCurrency } from '../../utils/decimalUtils';
import './BillInvoice.css';

const { Title, Text } = Typography;

interface BillInvoiceProps {
  orderId: number;
  dateOfPurchase: string;
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

const BillInvoice = forwardRef<HTMLDivElement, BillInvoiceProps>(
  ({
    orderId,
    dateOfPurchase,
    customerInfo,
    orderItems,
    billDetails,
    orderAmount,
    billAmount,
    paymentMethod,
    paymentStatus,
  }, ref) => {

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const getPaymentMethodText = (method: string): string => {
      switch (method) {
        case 'CASH':
          return 'Cash';
        case 'CREDIT_CARD':
          return 'Credit Card';
        case 'BANK_TRANSFER':
          return 'Bank Transfer';
        case 'MOBILE_PAYMENT':
          return 'Mobile Payment';
        default:
          return method;
      }
    };

    const getPaymentStatusText = (status: string): string => {
      switch (status) {
        case 'PENDING':
          return 'Unpaid';
        case 'COMPLETED':
          return 'Paid';
        default:
          return status;
      }
    };

    return (
      <div ref={ref} className="bill-invoice">
        <div className="bill-header">
          <div className="bill-logo">
            <Title level={2}>SUPERMARKET</Title>
          </div>
          <div className="bill-info">
            <Title level={3}>SALES INVOICE</Title>
            <Text>Invoice No: #{orderId.toString().padStart(6, '0')}</Text>
            <Text>Date: {dateOfPurchase ? formatDate(dateOfPurchase) : new Date().toLocaleDateString('en-US')}</Text>
          </div>
        </div>

        <Divider />

        <div className="bill-customer">
          <div>
            <Text strong>Customer:</Text>
            <Text>{customerInfo.fullName}</Text>
          </div>
          <div>
            <Text strong>Address:</Text>
            <Text>{customerInfo.address}</Text>
          </div>
          <div>
            <Text strong>Phone:</Text>
            <Text>{customerInfo.phone}</Text>
          </div>
        </div>

        <Divider />

        <div className="bill-products">
          <table className="product-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Promotion</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => {
                let finalPrice = item.price;
                if (item.discountPercent) {
                  finalPrice = multiplyDecimals(item.price, (100 - item.discountPercent) / 100, 2);
                } else if (item.discountAmount) {
                  finalPrice = item.price - item.discountAmount;
                }

                const itemTotal = multiplyDecimals(finalPrice, item.quantity, 2);

                return (
                  <tr key={item.productId}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{formatCurrency(item.price, 'USD', 2)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.promotionDescription || '-'}</td>
                    <td>{formatCurrency(itemTotal, 'USD', 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Divider />

        <div className="bill-summary">
          <div className="bill-details">
            {billDetails.map((detail, index) => (
              <div key={index} className="detail-row">
                <Text>{detail.description}</Text>
                <Text>{formatCurrency(detail.amount, 'USD', 2)}</Text>
              </div>
            ))}
            <div className="detail-row">
              <Text strong>Subtotal:</Text>
              <Text>{formatCurrency(orderAmount, 'USD', 2)}</Text>
            </div>
            <div className="detail-row total">
              <Text strong>Total Amount:</Text>
              <Text strong>{formatCurrency(billAmount, 'USD', 2)}</Text>
            </div>
          </div>
        </div>

        <Divider />

        <div className="bill-payment">
          <div className="payment-row">
            <Text strong>Payment Method:</Text>
            <Text>{getPaymentMethodText(paymentMethod)}</Text>
          </div>
          <div className="payment-row">
            <Text strong>Payment Status:</Text>
            <Text>{getPaymentStatusText(paymentStatus)}</Text>
          </div>
        </div>

        <div className="bill-footer">
          <Text>Thank you for shopping at Supermarket!</Text>
          <Text>Address: 123 ABC Street, District 1, Ho Chi Minh City</Text>
          <Text>Hotline: 1900-1234</Text>
          <Text>Website: www.supermarket.com</Text>
        </div>
      </div>
    );
  }
);

export default BillInvoice;
