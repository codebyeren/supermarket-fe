import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, message, Space, Popconfirm } from 'antd';
import type { Order, OrderItem } from '../../types';
import orderService from '../../services/orderService';
import { LoadingService } from '../../services/LoadingService';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const loadingService = LoadingService.getInstance();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      loadingService.showLoading();
      const response = await orderService.getOrders();
      if (response.code === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
      loadingService.hideLoading();
    }
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrder(true);
      loadingService.showLoading();
      
      const response = await orderService.updateOrder({
        orderId,
        orderStatus: 'CANCCELLED'
      });
      
      if (response.code === 200) {
        message.success('Đã hủy đơn hàng thành công');
        
        // Cập nhật trạng thái đơn hàng trong danh sách
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, orderStatus: 'CANCCELLED' } 
              : order
          )
        );
        
        // Cập nhật trạng thái đơn hàng đang xem chi tiết (nếu có)
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'CANCCELLED' });
        }
      } else {
        message.error(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      message.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancellingOrder(false);
      loadingService.hideLoading();
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.orderStatus === 'PENDING';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge status="warning" text="Đang xử lý" />;
      case 'SHIPPED':
        return <Badge status="processing" text="Đang giao hàng" />;
      case 'CONFIRMED':
        return <Badge status="success" text="Đã xác nhận" />;
      case 'CANCCELLED':
        return <Badge status="error" text="Đã hủy" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge status="warning" text="Chưa thanh toán" />;
      case 'COMPLETED':
        return <Badge status="success" text="Đã thanh toán" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Tiền mặt';
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản';
      case 'MOBILE_PAYMENT':
        return 'Ví điện tử';
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'dateOfPurchase',
      key: 'dateOfPurchase',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'billAmount',
      key: 'billAmount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => getPaymentStatusBadge(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space>
          <Button type="primary" onClick={() => showOrderDetail(record)}>
            Xem chi tiết
          </Button>
          {canCancelOrder(record) && (
            <Popconfirm
              title="Hủy đơn hàng"
              description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
              onConfirm={() => handleCancelOrder(record.orderId)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger loading={cancellingOrder}>
                Hủy đơn
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="order-history-container">
      <h2 className="mb-4">Lịch sử đơn hàng</h2>
      
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="orderId"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {selectedOrder && (
        <Modal
          title={`Chi tiết đơn hàng #${selectedOrder.orderId}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            canCancelOrder(selectedOrder) && (
              <Popconfirm
                key="cancel"
                title="Hủy đơn hàng"
                description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                onConfirm={() => handleCancelOrder(selectedOrder.orderId)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="primary" danger loading={cancellingOrder}>
                  Hủy đơn hàng
                </Button>
              </Popconfirm>
            ),
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ].filter(Boolean)}
          width={800}
        >
          <div className="order-detail">
            <div className="order-info">
              <p><strong>Ngày đặt hàng:</strong> {formatDate(selectedOrder.dateOfPurchase)}</p>
              <p><strong>Trạng thái đơn hàng:</strong> {getStatusBadge(selectedOrder.orderStatus)}</p>
              <p><strong>Phương thức thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
              <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusBadge(selectedOrder.paymentStatus)}</p>
            </div>

            <h4>Sản phẩm</h4>
            <Table
              dataSource={selectedOrder.orderItems}
              rowKey="productId"
              pagination={false}
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'productName',
                  key: 'productName',
                  render: (text: string, record: OrderItem) => (
                    <div className="product-cell">
                      <img 
                        src={`/img/${record.imageUrl}`} 
                        alt={record.productName} 
                        className="product-thumbnail" 
                      />
                      <span>{text}</span>
                    </div>
                  ),
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => formatCurrency(price),
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Khuyến mãi',
                  key: 'promotion',
                  render: (_, record: OrderItem) => record.promotionDescription || 'Không có',
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record: OrderItem) => {
                    let price = record.price;
                    if (record.discountPercent) {
                      price = price * (1 - record.discountPercent / 100);
                    } else if (record.discountAmount) {
                      price = price - record.discountAmount;
                    }
                    return formatCurrency(price * record.quantity);
                  },
                },
              ]}
            />

            <div className="order-summary">
              <div className="bill-details">
                <h4>Chi tiết hóa đơn</h4>
                {selectedOrder.billDetails.map((detail, index) => (
                  <div key={index} className="bill-detail-item">
                    <span>{detail.description}</span>
                    <span>{formatCurrency(detail.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <div className="total-row">
                  <span>Tổng tiền sản phẩm:</span>
                  <span>{formatCurrency(selectedOrder.orderAmount)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Tổng thanh toán:</span>
                  <span>{formatCurrency(selectedOrder.billAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderHistory; 