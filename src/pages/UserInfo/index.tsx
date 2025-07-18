import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import Notification from '../../components/Notification';
import { getUserInfo, updateUserInfo, type UserInfo as UserInfoType } from '../../services/user';

export interface UserFormData {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  homePhone?: string;
  creditCardNumber?: string | null;
  creditCardExpiry?: string | null;
  state?: string;
  city?: string;
  street?: string;
  mobile: string;
  country: string;
  dob: string;
}

export default function UserInfoPage() {
  const [user, setUser] = useState<UserInfoType | null>(null);
  const [form, setForm] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
        setForm({
          email: userInfo.email,
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
          homePhone: userInfo.homePhone || '',
          creditCardNumber: userInfo.creditCardNumber || '',
          creditCardExpiry: userInfo.creditCardExpiry || '',
          state: userInfo.state || '',
          city: userInfo.city || '',
          street: userInfo.street || '',
          mobile: userInfo.mobile,
          country: userInfo.country,
          dob: userInfo.dob,
        });
      } catch (err) {
        console.error('Failed to load user info:', err);
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
      const res = await updateUserInfo({ ...form });

      if (res.code === 200) {
        setUser({ ...user!, ...form });
        setEditing(false);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Update error:', err);
      setSuccess(false);
    } finally {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const countryOptions = [
    { value: '', label: 'Select country...' },
    { value: 'VN', label: 'Vietnam' },
    { value: 'US', label: 'United States' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'CN', label: 'China' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'SG', label: 'Singapore' },
    { value: 'TH', label: 'Thailand' },
    { value: 'AU', label: 'Australia' },
    { value: 'CA', label: 'Canada' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'PH', label: 'Philippines' },
  ];

  if (loading) return <div className="p-4">Loading user information...</div>;
  if (!user || !form) return <div className="p-4 text-danger">User information not found.</div>;

  const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;

  return (
    <div className="container-fluid min-vh-100 bg-light">
      {showNotification && (
        <Notification
          message={success ? 'Update successful' : 'Update failed'}
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
          <h3 className="text-center mb-4">User Information</h3>

          <form className="row g-3 bg-white p-4 shadow rounded" onSubmit={e => e.preventDefault()}>
            <div className="col-12 mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={fullName} disabled readOnly />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile Phone</label>
              <input type="text" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Home Phone</label>
              <input type="text" name="homePhone" className="form-control" value={form.homePhone || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" className="form-control" value={form.dob} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Country</label>
              <select name="country" className="form-select" value={form.country} onChange={handleChange} disabled={!editing}>
                {countryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">State / Province</label>
              <input type="text" name="state" className="form-control" value={form.state || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-control" value={form.city || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Street</label>
              <input type="text" name="street" className="form-control" value={form.street || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Credit Card Number</label>
              <input type="text" name="creditCardNumber" className="form-control" value={form.creditCardNumber || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Credit Card Expiry</label>
              <input type="text" name="creditCardExpiry" className="form-control" placeholder="MM/YY" value={form.creditCardExpiry || ''} onChange={handleChange} disabled={!editing} />
            </div>

            <div className="col-12">
              {editing ? (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button type="button" className="btn btn-success w-100" onClick={handleSave}>Save Changes</button>
                  <button type="button" className="btn btn-secondary w-100" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              ) : (
                <button type="button" style ={{backgroundColor : '#7c3aed'}}className="btn btn-primary w-100" onClick={() => setEditing(true)}>Edit</button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
