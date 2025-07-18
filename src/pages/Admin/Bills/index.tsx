import React, { useState } from 'react';
import './Bills.css';
import '../../../styles/admin-common.css';

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
      customerName: 'Nguyen Van A',
      totalAmount: 150000,
      status: 'confirmed',
      paymentMethod: 'Cash',
      createdAt: '2024-01-15',
      items: 3
    },
    {
      id: 'BILL002',
      customerName: 'Tran Thi B',
      totalAmount: 250000,
      status: 'delivered',
      paymentMethod: 'Bank Transfer',
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="admin-bills">
      <div className="bills-header">
        <h1>Manage Bills</h1>
        <button className="add-bill-btn">+ Create Bill</button>
      </div>

      <div className="bills-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by bill ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select text-dark"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Items</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
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
                    disabled={bill.status === "cancelled"}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{bill.createdAt}</td>
                <td>
                  <div className="action-buttons">
                    <button className="admin-btn view-btn">View</button>
                    <button className="admin-btn edit-btn">Edit</button>
                    <button className="admin-btn delete-btn">Delete</button>
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
    </div>
  );
}
