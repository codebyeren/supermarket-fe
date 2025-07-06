import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import { getUserInfo, updateUserInfo, type UserInfo } from '../../services/user';
import Notification from '../../components/Notification';

export default function UserInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState<UserInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData) return;

    const [firstName, middleName = '', lastName = ''] = formData.fullName.trim().split(' ');

    const payload = {
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      country: formData.country,
      dob: formData.dob,
      street: '',
      city: '',
      state: '',
      firstName,
      middleName,
      lastName
    };

    try {
      const res = await updateUserInfo(payload);
      if (res.code === 200) {
  
        setUser(formData);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      setSuccess(false);
    }finally{
      setShowNotification(true);
    }
  };
  const countryOptions = [
    { value: 'VN', label: 'Việt Nam' },
    { value: 'US', label: 'Hoa Kỳ' },
    { value: 'JP', label: 'Nhật Bản' },
    { value: 'KR', label: 'Hàn Quốc' },
    { value: 'CN', label: 'Trung Quốc' },
    { value: 'FR', label: 'Pháp' },
    { value: 'DE', label: 'Đức' },
    { value: 'GB', label: 'Anh' },
    { value: 'SG', label: 'Singapore' },
    { value: 'TH', label: 'Thái Lan' },
    // Add more as needed
  ];
  if (loading) return <div className="p-4">Đang tải thông tin người dùng...</div>;
  if (!user || !formData) return <div className="p-4 text-danger">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div>
        {showNotification && (
          <Notification
            message={ success ? 'Cập nhật thông tin thành công' : 'cập nhật thông tin thất bại'}
            duration={2000}
            borderColor={success ? 'green' : 'red'}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
      <div className="d-flex flex-column flex-lg-row gap-4 py-4" style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Sidebar */}
        <aside className="bg-white rounded shadow-sm p-3" style={{ minWidth: 280, flexShrink: 0 }}>
          <Sidebar />
        </aside>

        {/* Main Form */}
        <main className="flex-grow-1">
          <h3 className="text-center mb-4">Thông Tin Người Dùng</h3>

         

          <form className="row g-3 bg-white p-4 shadow rounded" onSubmit={e => e.preventDefault()}>
            <div className="col-md-6">
              <label className="form-label">Họ tên đầy đủ</label>
              <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Quốc gia</label>
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">-- Chọn quốc gia --</option>
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Ngày sinh</label>
              <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Điện thoại</label>
              <input type="text" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-12">
              {editing ? (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button type="button" className="btn btn-success w-100" onClick={handleSave}>
                    Lưu thay đổi
                  </button>
                  <button type="button" className="btn btn-secondary w-100" onClick={() => setEditing(false)}>
                    Hủy
                  </button>
                </div>
              ) : (
                <button type="button" className="btn btn-primary w-100" onClick={() => setEditing(true)}>
                  Chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
