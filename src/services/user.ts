export interface UserInfo {
  customerId: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  mobile: string;
  country: string;
  dob: string;
}
export interface UpdateUserInfoInput {
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  dob: string;
  street?: string;
  city?: string;
  state?: string;
}
export interface ApiResponse {
  code: number;
  message: string;
  data?: any;
}

export async function getUserInfo(): Promise<UserInfo> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('Token không tồn tại');
  }

  const res = await fetch('http://localhost:5050/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = `HTTP error ${res.status} – ${res.statusText}`;
    throw new Error(message);
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error('Phản hồi từ server không hợp lệ (không phải JSON)');
  }

  if (json.code !== 200 || !json.data) {
    throw new Error(json.message || 'Lỗi khi lấy thông tin người dùng');
  }

  return json.data as UserInfo;
}

export async function updateUserInfo(userInfo: UpdateUserInfoInput): Promise<ApiResponse> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('Token không tồn tại');
  }

  const res = await fetch('http://localhost:5050/api/auth/update-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userInfo),
  });

  if (!res.ok) {
    const message = `HTTP error ${res.status} – ${res.statusText}`;
    throw new Error(message);
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error('Phản hồi từ server không hợp lệ (không phải JSON)');
  }

  return json as ApiResponse; 
}
