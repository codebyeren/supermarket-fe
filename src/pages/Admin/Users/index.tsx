import React, { useEffect, useState } from 'react';
import './Users.css';
import '../../../styles/admin-common.css';
import axiosInstance from '../../../services/axiosInstance';

const defaultUserForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  mobile: '',
  country: '',
  homePhone: '',
  creditCardNumber: '',
  creditCardExpiry: '',
  cardHolderName: '',
  cvv: '',
  dob: '',
  street: '',
  city: '',
  state: '',
  address: '',
};

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'ADMIN' | 'USER'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState<any>(defaultUserForm);
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('auth/users');
      const cleanUsers = (res.data.data || []).map((u: any) => {
        const { password, ...rest } = u;
        return rest;
      });
      setUsers(cleanUsers);
    } catch (err) {
      window.alert('Không thể tải danh sách người dùng!');
    }
  };

  const openAddUser = () => {
    setEditingUser(null);
    setForm(defaultUserForm);
    setFormErrors({}); // Clear errors when opening add form
    setShowForm(true);
  };

  const openEditUser = (user: any) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobile: user.mobile || '',
      country: user.country || '',
      homePhone: user.homePhone || '',
      creditCardNumber: user.creditCardNumber || '',
      creditCardExpiry: user.creditCardExpiry || '',
      cardHolderName: user.cardHolderName || '',
      cvv: user.cvv || '',
      dob: user.dob || '',
      street: user.street || '',
      city: user.city || '',
      state: user.state || '',
      address: user.address || '',
    });
    setFormErrors({}); // Clear errors when opening edit form
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
    setFormErrors((prev: any) => ({ ...prev, [name]: '' })); // Clear error for the specific field
  };

  const validateForm = () => {
    const errors: any = {};
    if (!form.firstName) errors.firstName = 'First name is required';
    if (!form.lastName) errors.lastName = 'Last name is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.mobile) errors.mobile = 'Mobile number is required';
    else if (!/^\d+$/.test(form.mobile)) errors.mobile = 'Mobile number must be digits only';
    if (!form.country) errors.country = 'Country is required';
    if (!form.dob) errors.dob = 'Date of birth is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) errors.dob = 'Date of birth must be yyyy-mm-dd';
    return errors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    // Chuẩn hóa request body đúng format, các trường null nếu rỗng
    const requestBody: any = { ...form };
    [
      'middleName', 'homePhone', 'creditCardNumber', 'creditCardExpiry', 'cardHolderName', 'cvv', 'street', 'city', 'state', 'address'
    ].forEach(key => {
      if (requestBody[key] === '') requestBody[key] = null;
    });
    try {
      if (editingUser) {
        await axiosInstance.put(`auth/users/${editingUser.customerId}`, requestBody);
        window.alert('Cập nhật người dùng thành công!');
      } else {
        await axiosInstance.post('auth/users', requestBody);
        window.alert('Thêm người dùng thành công!');
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      window.alert('Lưu người dùng thất bại!');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = filterRole === 'all' || (user.role || '').toLowerCase() === filterRole;
    // Bỏ filterStatus
    return matchesSearch && matchesRole;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: 'ADMIN' | 'USER') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>User Management</h1>
        <button className="add-user-btn" onClick={openAddUser}>+ Add User</button>
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
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>Date of Birth</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.customerId}>
                <td>{user.customerId}</td>
                <td>{user.firstName}</td>
                <td>{user.middleName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.country}</td>
                <td>{user.dob}</td>
                <td>{user.username}</td>
                <td>{(user.role || '').toLowerCase()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="admin-btn edit-btn" onClick={() => openEditUser(user)}>Edit</button>
                    <button className="admin-btn delete-btn" disabled={user.username === 'ADMIN'}>Delete</button>
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

      {showForm && (
        <div className="modal-overlay" style={{zIndex: 9999}}>
          <div style={{background: '#fff', borderRadius: 12, padding: 32, maxWidth: 700, margin: '40px auto', boxShadow: '0 2px 16px #eee'}}>
            <h2 style={{marginBottom: 24, fontWeight: 700, fontSize: 22, textAlign: 'center'}}>{editingUser ? 'Update User' : 'Add New User'}</h2>
            <form onSubmit={handleFormSubmit} style={{display: 'flex', gap: 32, flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14}}>
                <div>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="First Name" className="admin-search-input" required />
                  {formErrors.firstName && <div style={{color: 'red', fontSize: 13}}>{formErrors.firstName}</div>}
                </div>
                <div>
                  <input name="middleName" value={form.middleName || ''} onChange={handleFormChange} placeholder="Middle Name (optional)" className="admin-search-input" />
                </div>
                <div>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Last Name" className="admin-search-input" required />
                  {formErrors.lastName && <div style={{color: 'red', fontSize: 13}}>{formErrors.lastName}</div>}
                </div>
                <div>
                  <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" className="admin-search-input" required />
                  {formErrors.email && <div style={{color: 'red', fontSize: 13}}>{formErrors.email}</div>}
                </div>
                <div>
                  <input name="mobile" value={form.mobile} onChange={handleFormChange} placeholder="Mobile" className="admin-search-input" required />
                  {formErrors.mobile && <div style={{color: 'red', fontSize: 13}}>{formErrors.mobile}</div>}
                </div>
                <div>
                  <input name="country" value={form.country} onChange={handleFormChange} placeholder="Country" className="admin-search-input" required />
                  {formErrors.country && <div style={{color: 'red', fontSize: 13}}>{formErrors.country}</div>}
                </div>
                <div>
                  <input name="dob" value={form.dob} onChange={handleFormChange} placeholder="Date of Birth (YYYY-MM-DD)" className="admin-search-input" required />
                  {formErrors.dob && <div style={{color: 'red', fontSize: 13}}>{formErrors.dob}</div>}
                </div>
              </div>
              <div style={{flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14}}>
                <input name="homePhone" value={form.homePhone || ''} onChange={handleFormChange} placeholder="Home Phone (optional)" className="admin-search-input" />
                <input name="creditCardNumber" value={form.creditCardNumber || ''} onChange={handleFormChange} placeholder="Credit Card Number (optional)" className="admin-search-input" />
                <input name="creditCardExpiry" value={form.creditCardExpiry || ''} onChange={handleFormChange} placeholder="Credit Card Expiry (YYYY-MM-DD, optional)" className="admin-search-input" />
                <input name="cardHolderName" value={form.cardHolderName || ''} onChange={handleFormChange} placeholder="Card Holder Name (optional)" className="admin-search-input" />
                <input name="cvv" value={form.cvv || ''} onChange={handleFormChange} placeholder="CVV (optional)" className="admin-search-input" />
                <input name="street" value={form.street || ''} onChange={handleFormChange} placeholder="Street (optional)" className="admin-search-input" />
                <input name="city" value={form.city || ''} onChange={handleFormChange} placeholder="City (optional)" className="admin-search-input" />
                <input name="state" value={form.state || ''} onChange={handleFormChange} placeholder="State (optional)" className="admin-search-input" />
                <input name="address" value={form.address || ''} onChange={handleFormChange} placeholder="Address (optional)" className="admin-search-input" />
              </div>
              <div style={{width: '100%', display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 16}}>
                <button type="submit" className="admin-btn edit-btn" style={{fontSize: 16, padding: '10px 32px'}}>{editingUser ? 'Update' : 'Add'}</button>
                <button type="button" className="admin-btn delete-btn" style={{fontSize: 16, padding: '10px 32px'}} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 