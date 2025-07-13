import React, { useState } from 'react';
import './Bills.css';

interface Bill {
  id: string;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  items: number;
}

export default function AdminBills() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 'BILL001',
      customerName: 'Nguyễn Văn A',
      totalAmount: 150000,
      status: 'confirmed',
      paymentMethod: 'Tiền mặt',
      createdAt: '2024-01-15',
      items: 3
    },
    {
      id: 'BILL002',
      customerName: 'Trần Thị B',
      totalAmount: 250000,
      status: 'delivered',
      paymentMethod: 'Chuyển khoản',
      createdAt: '2024-01-14',
      items: 5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (billId: string, newStatus: Bill['status']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status: newStatus } : bill
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: Bill['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="admin-bills">
      <div className="bills-header">
        <h1>Quản lý hóa đơn</h1>
        <button className="add-bill-btn">+ Tạo hóa đơn</button>
      </div>

      <div className="bills-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hóa đơn hoặc tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Mã hóa đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Số sản phẩm</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill.id}>
                <td className="bill-id">{bill.id}</td>
                <td>{bill.customerName}</td>
                <td className="bill-amount">{formatPrice(bill.totalAmount)}</td>
                <td>{bill.items}</td>
                <td>{bill.paymentMethod}</td>
                <td>
                  <select
                    value={bill.status}
                    onChange={(e) => handleStatusChange(bill.id, e.target.value as Bill['status'])}
                    className={`status-select ${getStatusColor(bill.status)}`}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>{bill.createdAt}</td>
                <td>
                  <div className="action-buttons">
                    <button className="view-btn">Xem</button>
                    <button className="edit-btn">Sửa</button>
                    <button className="delete-btn">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBills.length === 0 && (
        <div className="no-bills">
          <p>Không tìm thấy hóa đơn nào</p>
        </div>
      )}
    </div>
  );
} 