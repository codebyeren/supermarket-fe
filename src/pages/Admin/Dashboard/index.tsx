import React from 'react';
import './Dashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng đến với Admin Panel</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-placeholder">
          <div className="placeholder-icon">📊</div>
          <h2>Dashboard đang được phát triển</h2>
          <p>Nội dung dashboard sẽ được cập nhật sau</p>
        </div>
      </div>
    </div>
  );
} 