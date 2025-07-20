import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillModal from '../../../components/Bill/BillModal';
import './Bills.css';
import '../../../styles/admin-common.css';
import type { PromotionType, ItemType } from '../../../types';
import orderService from '../../../services/orderService';

interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  slug: string;
  imageUrl: string;
  quantity: number;
  promotionId: number | null;
  promotionType: string | null;
  promotionDescription: string | null;
  discountPercent: number | null;
  discountAmount: number | null;
  giftProductId: number | null;
  giftProductName: string | null;
  giftProductImg: string | null;
  giftProductSlug: string | null;
  minOrderValue: number | null;
  minOrderQuantity: number | null;
}

interface BillDetail {
  itemType: string;
  amount: number;
  description: string;
}

interface Bill {
  billId: number;
  orderId: number;
  orderStatus: string;
  dateOfPurchase: string;
  orderItems: OrderItem[];
  billDetails: BillDetail[];
  orderAmount: number;
  billAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const API_URL = 'http://localhost:5050/api/orders';

export default function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      setBills(res.data || []);
    } catch (err) {
      // window.alert('Không thể tải danh sách hóa đơn!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bill: Bill, newStatus: string) => {
    try {
      await orderService.updateOrder({ orderId: bill.orderId, orderStatus: newStatus });
      window.alert('Cập nhật trạng thái đơn hàng thành công!');
      fetchBills();
    } catch (err) {
      window.alert('Cập nhật trạng thái đơn hàng thất bại!');
    }
  };

  const handleBillStatusChange = async (bill: Bill, newPaymentMethod: string, newPaymentStatus: string) => {
    try {
      await orderService.updateBill({ billId: bill.billId, paymentMethod: newPaymentMethod, paymentStatus: newPaymentStatus });
      window.alert('Cập nhật trạng thái hóa đơn thành công!');
      fetchBills();
    } catch (err) {
      window.alert('Cập nhật trạng thái hóa đơn thất bại!');
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billId.toString().includes(searchTerm) || bill.orderId.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || bill.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'SHIPPED': return 'primary';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const convertOrderItems = (items: any[]): import('../../../types').OrderItem[] => {
    return items.map(item => ({
      ...item,
      promotionType: item.promotionType as PromotionType | null,
    }));
  };
  const convertBillDetails = (details: any[]): import('../../../types').BillDetail[] => {
    return details.map(detail => ({
      ...detail,
      itemType: detail.itemType as ItemType,
    }));
  };

  return (
    <div className="admin-bills">
      <div className="bills-header">
        <h1>Bill Management</h1>
        {/* Nút tạo mới hóa đơn, có thể mở modal tạo mới */}
        {/* <button className="add-bill-btn">+ Create Bill</button> */}
      </div>

      <div className="bills-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by bill ID or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select text-dark"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Order Amount</th>
              <th>Bill Amount</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill.billId}>
                <td className="bill-id">{bill.billId}</td>
                <td>{bill.orderId}</td>
                <td>
                  <select
                    value={bill.orderStatus}
                    onChange={e => handleStatusChange(bill, e.target.value)}
                    className={`status-select ${getStatusColor(bill.orderStatus)}`}
                    disabled={bill.orderStatus === 'CANCELLED'}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td>{bill.dateOfPurchase ? new Date(bill.dateOfPurchase).toLocaleString() : ''}</td>
                <td className="bill-amount">{formatPrice(bill.orderAmount)}</td>
                <td className="bill-amount">{formatPrice(bill.billAmount)}</td>
                <td>{bill.paymentMethod}</td>
                <td>{bill.paymentStatus}</td>
                <td>
                  <div className="action-buttons">
                    <button className="admin-btn view-btn" onClick={() => { setSelectedBill(bill); setShowModal(true); }}>View</button>
                    {/* Có thể thêm nút Edit trạng thái bill nếu muốn */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBills.length === 0 && (
        <div className="no-bills">
          <p>No bills found</p>
        </div>
      )}

      {/* Modal chi tiết hóa đơn */}
      {selectedBill && (
        <BillModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          orderId={selectedBill.orderId}
          dateOfPurchase={selectedBill.dateOfPurchase}
          customerInfo={{ fullName: 'Customer', address: '-', phone: '-' }}
          orderItems={convertOrderItems(selectedBill.orderItems)}
          billDetails={convertBillDetails(selectedBill.billDetails)}
          orderAmount={selectedBill.orderAmount}
          billAmount={selectedBill.billAmount}
          paymentMethod={selectedBill.paymentMethod}
          paymentStatus={selectedBill.paymentStatus}
        />
      )}
    </div>
  );
}
