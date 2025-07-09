import React from 'react';
import OrderHistory from '../../components/OrderHistory';
import Sidebar from '../../components/SideBar';

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="d-flex flex-column flex-lg-row gap-4 py-4" style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Sidebar */}
        <aside className="bg-white rounded shadow-sm p-3" style={{ minWidth: 280, flexShrink: 0 }}>
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-grow-1 bg-white shadow-sm rounded p-4">
          <h4 className="mb-4">Lịch Sử Đơn Hàng</h4>
          <OrderHistory />
        </main>
      </div>
    </div>
  );
};

export default OrderHistoryPage; 