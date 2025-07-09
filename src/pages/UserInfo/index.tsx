import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import Notification from '../../components/Notification';
import { getUserInfo, updateUserInfo } from '../../services/user';

export interface UserInfo {
  username: string;
  email: string;
  mobile: string;
  country: string;
  dob: string;
  street?: string;
  city?: string;
  state?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  creditCardNumber: string;
  creditCardExpiry: string;
}

export default function UserInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [form, setForm] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserInfo();
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error('Lỗi tải thông tin người dùng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      const res = await updateUserInfo(form);
      if (res.code === 200) {
        setUser(form);
        setEditing(false);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      setSuccess(false);
    } finally {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const countryOptions = [
    { value: '', label: 'Chọn quốc gia...' },
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
    { value: 'AU', label: 'Úc' },
    { value: 'CA', label: 'Canada' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'PH', label: 'Philippines' }
  ];

  if (loading) return <div className="p-4">Đang tải thông tin người dùng...</div>;
  if (!user || !form) return <div className="p-4 text-danger">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="container-fluid min-vh-100 bg-light">
      {showNotification && (
        <Notification
          message={success ? 'Cập nhật thành công' : 'Cập nhật thất bại'}
          duration={3000}
          borderColor={success ? 'green' : 'red'}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="d-flex flex-column flex-lg-row gap-4 py-4" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <aside className="bg-white rounded shadow-sm p-3" style={{ minWidth: 280 }}>
          <Sidebar />
        </aside>

        <main className="flex-grow-1">
          <h3 className="text-center mb-4">Thông Tin Người Dùng</h3>

          <form className="row g-3 bg-white p-4 shadow rounded" onSubmit={e => e.preventDefault()}>
            <div className="col-md-4">
              <label className="form-label">Họ</label>
              <input type="text" name="firstName" className="form-control" value={form.firstName} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tên đệm</label>
              <input type="text" name="middleName" className="form-control" value={form.middleName ?? ''} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tên</label>
              <input type="text" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số điện thoại</label>
              <input type="text" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Ngày sinh</label>
              <input type="date" name="dob" className="form-control" value={form.dob} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Quốc gia</label>
              <select name="country" className="form-select" value={form.country} onChange={handleChange} disabled={!editing}>
                {countryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Thành phố</label>
              <input type="text" name="city" className="form-control" value={form.city ?? ''} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tỉnh / Bang</label>
              <input type="text" name="state" className="form-control" value={form.state ?? ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Số nhà / Đường</label>
              <input type="text" name="street" className="form-control" value={form.street ?? ''} onChange={handleChange} disabled={!editing} />
            </div>



            <div className="col-md-6">
              <label className="form-label">Số thẻ tín dụng</label>
              <input type="text" name="creditCardNumber" className="form-control" value={form.creditCardNumber} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Ngày hết hạn thẻ</label>
              <input type="text" name="creditCardExpiry" className="form-control" placeholder="MM/YY" value={form.creditCardExpiry} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-12">
              {editing ? (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button type="button" className="btn btn-success w-100" onClick={handleSave}>Lưu thay đổi</button>
                  <button type="button" className="btn btn-secondary w-100" onClick={() => setEditing(false)}>Hủy</button>
                </div>
              ) : (
                <button type="button" className="btn btn-primary w-100" onClick={() => setEditing(true)}>Chỉnh sửa</button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
