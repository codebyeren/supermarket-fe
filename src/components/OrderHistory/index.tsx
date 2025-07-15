import React, { useEffect, useState } from 'react';
import { Badge, Button, Modal, message, Space, Popconfirm, Card, Row, Col, Tag } from 'antd';
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
      console.error('Error fetching orders:', error);
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
        orderStatus: 'CANCELLED',
      });

      if (response.code === 200) {
        message.success('Order cancelled successfully');
        setOrders(prev => prev.map(order => order.orderId === orderId ? { ...order, orderStatus: 'CANCELLED' } : order));
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'CANCELLED' });
        }
      } else {
        message.error(response.message || 'Unable to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      message.error('An error occurred while cancelling the order');
    } finally {
      setCancellingOrder(false);
      loadingService.hideLoading();
    }
  };

  const canCancelOrder = (order: Order) => order.orderStatus === 'PENDING';

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING': return <Tag color="warning">Processing</Tag>;
      case 'SHIPPED': return <Tag color="processing">Shipping</Tag>;
      case 'CONFIRMED': return <Tag color="success">Confirmed</Tag>;
      case 'CANCELLED': return <Tag color="error">Cancelled</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING': return <Tag color="warning">Unpaid</Tag>;
      case 'COMPLETED': return <Tag color="success">Paid</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH': return 'Cash';
      case 'CREDIT_CARD': return 'Credit Card';
      case 'BANK_TRANSFER': return 'Bank Transfer';
      case 'MOBILE_PAYMENT': return 'Mobile Payment';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderOrderCards = () => {
    if (loading) return <p>Loading...</p>;

    if (orders.length === 0) {
      return <div className="text-center text-muted py-5"><p className="fs-5">You have no orders yet.</p></div>;
    }

    return (
      <Row gutter={[16, 16]}>
        {orders.map(order => (
          <Col xs={24} sm={12} md={8} lg={6} key={order.orderId}>
            <Card
              hoverable
              className="order-card text-start"
              title={`Order #${order.orderId}`}
              extra={getStatusTag(order.orderStatus)}
              onClick={() => showOrderDetail(order)}
            >
              <p><strong>Order Date:</strong> {formatDate(order.dateOfPurchase)}</p>
              <p><strong>Total Amount:</strong> {formatCurrency(order.billAmount)}</p>
              <p><strong>Payment:</strong> {getPaymentMethodText(order.paymentMethod)} {getPaymentStatusTag(order.paymentStatus)}</p>
              <p><strong>Items:</strong> {order.orderItems.length}</p>

              {canCancelOrder(order) && (
                <div className="mt-2 text-end">
                  <Popconfirm
                    title="Cancel Order"
                    description="Are you sure you want to cancel this order?"
                    onConfirm={(e) => { e?.stopPropagation(); handleCancelOrder(order.orderId); }}
                    okText="Yes"
                    cancelText="No"
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button
                      type="primary"
                      danger
                      size="small"
                      loading={cancellingOrder}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Cancel Order
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
    <div className="order-history-container text-start">
      {renderOrderCards()}

      {selectedOrder && (
        <Modal
          title={`Order Details #${selectedOrder.orderId}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            canCancelOrder(selectedOrder) && (
              <Popconfirm
                key="cancel"
                title="Cancel Order"
                description="Are you sure you want to cancel this order?"
                onConfirm={() => handleCancelOrder(selectedOrder.orderId)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger loading={cancellingOrder}>
                  Cancel Order
                </Button>
              </Popconfirm>
            ),
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ].filter(Boolean)}
          width={800}
        >
          <div className="order-detail text-start">
            <div className="order-info">
              <p><strong>Order Date:</strong> {formatDate(selectedOrder.dateOfPurchase)}</p>
              <p><strong>Order Status:</strong> {getStatusTag(selectedOrder.orderStatus)}</p>
              <p><strong>Payment Method:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
              <p><strong>Payment Status:</strong> {getPaymentStatusTag(selectedOrder.paymentStatus)}</p>
              <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.orderAmount)}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedOrder.billAmount)}</p>
            </div>

            <h4>Products</h4>
            <div className="order-items">
              {selectedOrder.orderItems.map(item => (
                <Card key={item.productId} className="mb-2 text-start">
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
                      <p>Price: {formatCurrency(item.price)}</p>
                      <p>Quantity: {item.quantity}</p>
                      {item.promotionDescription && (
                        <p>Promotion: {item.promotionDescription}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedOrder.billDetails?.length > 0 && (
              <>
                <h4>Bill Details</h4>
                <div className="bill-details">
                  {selectedOrder.billDetails.map((detail, index) => (
                    <div key={index} className="d-flex justify-content-between">
                      <span>{detail.description}</span>
                      <span>{formatCurrency(detail.amount)}</span>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-2 fw-bold">
                    <span>Total</span>
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
