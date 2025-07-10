import React, { useEffect, useState } from 'react';
import { Badge, Button, Modal, message, Space, Popconfirm, Card, Row, Col, Tag, Tooltip } from 'antd';
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
        orderStatus: 'CANCELLED'
      });
      
      if (response.code === 200) {
        message.success('Đã hủy đơn hàng thành công');
        
        // Cập nhật trạng thái đơn hàng trong danh sách
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, orderStatus: 'CANCELLED' } 
              : order
          )
        );
        
        // Cập nhật trạng thái đơn hàng đang xem chi tiết (nếu có)
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'CANCELLED' });
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

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="warning">Đang xử lý</Tag>;
      case 'SHIPPED':
        return <Tag color="processing">Đang giao hàng</Tag>;
      case 'CONFIRMED':
        return <Tag color="success">Đã xác nhận</Tag>;
      case 'CANCELLED':
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="warning">Chưa thanh toán</Tag>;
      case 'COMPLETED':
        return <Tag color="success">Đã thanh toán</Tag>;
      default:
        return <Tag>{status}</Tag>;
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

  const renderOrderCards = () => {
    if (loading) {
      return <p>Đang tải...</p>;
    }

    if (orders.length === 0) {
      return (
        <div className="text-center text-muted py-5">
          <p className="fs-5">Bạn chưa có đơn hàng nào.</p>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {orders.map(order => (
          <Col xs={24} sm={12} md={8} lg={6} key={order.orderId}>
            <Card 
              hoverable
              className="order-card"
              title={`Đơn hàng #${order.orderId}`}
              extra={getStatusTag(order.orderStatus)}
              onClick={() => showOrderDetail(order)}
            >
              <p><strong>Ngày đặt:</strong> {formatDate(order.dateOfPurchase)}</p>
              <p><strong>Tổng tiền:</strong> {formatCurrency(order.billAmount)}</p>
              <p><strong>Thanh toán:</strong> {getPaymentMethodText(order.paymentMethod)} {getPaymentStatusTag(order.paymentStatus)}</p>
              <p><strong>Số sản phẩm:</strong> {order.orderItems.length}</p>
              
              {canCancelOrder(order) && (
                <div className="mt-2 text-end">
                  <Popconfirm
                    title="Hủy đơn hàng"
                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleCancelOrder(order.orderId);
                    }}
                    okText="Có"
                    cancelText="Không"
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button 
                      type="primary" 
                      danger 
                      size="small"
                      loading={cancellingOrder}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Hủy đơn
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="order-history-container">
      {renderOrderCards()}

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
              <p><strong>Trạng thái đơn hàng:</strong> {getStatusTag(selectedOrder.orderStatus)}</p>
              <p><strong>Phương thức thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
              <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusTag(selectedOrder.paymentStatus)}</p>
              <p><strong>Tổng tiền sản phẩm:</strong> {formatCurrency(selectedOrder.orderAmount)}</p>
              <p><strong>Tổng thanh toán:</strong> {formatCurrency(selectedOrder.billAmount)}</p>
            </div>

            <h4>Sản phẩm</h4>
            <div className="order-items">
              {selectedOrder.orderItems.map(item => (
                <Card key={item.productId} className="mb-2">
                  <div className="d-flex">
                    <div className="me-3">
                      {item.imageUrl && (
                        <img 
                          src={`/public/img/${item.imageUrl}`}
                          alt={item.productName} 
                          style={{ width: 80, height: 80, objectFit: 'cover' }} 
                        />
                      )}
                    </div>
                    <div>
                      <h5>{item.productName}</h5>
                      <p>Giá: {formatCurrency(item.price)}</p>
                      <p>Số lượng: {item.quantity}</p>
                      {item.promotionDescription && (
                        <p>Khuyến mãi: {item.promotionDescription}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedOrder.billDetails && selectedOrder.billDetails.length > 0 && (
              <>
                <h4>Chi tiết hóa đơn</h4>
                <div className="bill-details">
                  {selectedOrder.billDetails.map((detail, index) => (
                    <div key={index} className="d-flex justify-content-between">
                      <span>{detail.description}</span>
                      <span>{formatCurrency(detail.amount)}</span>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-2 fw-bold">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(selectedOrder.billAmount)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderHistory; 