import React, { forwardRef } from 'react';
import { Typography, Divider, Table } from 'antd';
import type { OrderItem, BillDetail } from '../../types';
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
    // Format ngày tháng
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // Chuyển đổi phương thức thanh toán để hiển thị
    const getPaymentMethodText = (method: string): string => {
      switch (method) {
        case 'CASH':
          return 'Tiền mặt';
        case 'CREDIT_CARD':
          return 'Thẻ tín dụng';
        case 'BANK_TRANSFER':
          return 'Chuyển khoản ngân hàng';
        case 'MOBILE_PAYMENT':
          return 'Thanh toán di động';
        default:
          return method;
      }
    };

    // Chuyển đổi trạng thái thanh toán để hiển thị
    const getPaymentStatusText = (status: string): string => {
      switch (status) {
        case 'PENDING':
          return 'Chưa thanh toán';
        case 'COMPLETED':
          return 'Đã thanh toán';
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
            <Title level={3}>HÓA ĐƠN BÁN HÀNG</Title>
            <Text>Số hóa đơn: #{orderId.toString().padStart(6, '0')}</Text>
            <Text>Ngày: {dateOfPurchase ? formatDate(dateOfPurchase) : new Date().toLocaleDateString('vi-VN')}</Text>
          </div>
        </div>

        <Divider />

        <div className="bill-customer">
          <div>
            <Text strong>Khách hàng:</Text>
            <Text>{customerInfo.fullName}</Text>
          </div>
          <div>
            <Text strong>Địa chỉ:</Text>
            <Text>{customerInfo.address}</Text>
          </div>
          <div>
            <Text strong>Số điện thoại:</Text>
            <Text>{customerInfo.phone}</Text>
          </div>
        </div>

        <Divider />

        <div className="bill-products">
          <table className="product-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Khuyến mãi</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => {
                // Tính giá sau khuyến mãi
                let finalPrice = item.price;
                if (item.discountPercent) {
                  finalPrice = finalPrice * (1 - item.discountPercent / 100);
                } else if (item.discountAmount) {
                  finalPrice = finalPrice - item.discountAmount;
                }

                // Tính tổng tiền cho mỗi sản phẩm
                const itemTotal = finalPrice * item.quantity;

                return (
                  <tr key={item.productId}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.promotionDescription || '-'}</td>
                    <td>${itemTotal.toFixed(2)}</td>
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
                <Text>${detail.amount.toFixed(2)}</Text>
              </div>
            ))}
            <div className="detail-row">
              <Text strong>Tổng giá sản phẩm:</Text>
              <Text>${orderAmount.toFixed(2)}</Text>
            </div>
            <div className="detail-row total">
              <Text strong>Tổng thanh toán:</Text>
              <Text strong>${billAmount.toFixed(2)}</Text>
            </div>
          </div>
        </div>

        <Divider />

        <div className="bill-payment">
          <div className="payment-row">
            <Text strong>Phương thức thanh toán:</Text>
            <Text>{getPaymentMethodText(paymentMethod)}</Text>
          </div>
          <div className="payment-row">
            <Text strong>Trạng thái thanh toán:</Text>
            <Text>{getPaymentStatusText(paymentStatus)}</Text>
          </div>
        </div>

        <div className="bill-footer">
          <Text>Cảm ơn quý khách đã mua hàng tại Supermarket!</Text>
          <Text>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</Text>
          <Text>Hotline: 1900-1234</Text>
          <Text>Website: www.supermarket.com</Text>
        </div>
      </div>
    );
  }
);

export default BillInvoice; 