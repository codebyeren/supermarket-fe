import React, { useEffect, useState } from 'react';
import './Users.css';
import '../../../styles/admin-common.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>Quản lý người dùng</h1>
        <button className="add-user-btn">+ Thêm người dùng</button>
      </div>

      <div className="users-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="filter-select text-dark"

          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select text-dark"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td >{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                    className="role-select text-dark  "
                    disabled={user.username === 'admin' }

                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td>{user.createdAt}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="toggle-status-btn"
                      onClick={() => handleStatusToggle(user.id)}
                        disabled={user.username === 'admin' }
                    >
                      {user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </button>
                    <button className="admin-btn edit-btn">Sửa</button>
                    <button className="admin-btn delete-btn"   disabled={user.username === 'admin' } >Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <p>Không tìm thấy người dùng nào</p>
        </div>
      )}
    </div>
  );
} 