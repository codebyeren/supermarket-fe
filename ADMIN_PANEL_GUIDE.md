# Hướng Dẫn Sử Dụng Admin Panel

## Tổng Quan
Admin Panel là hệ thống quản lý toàn diện cho siêu thị, được thiết kế với giao diện hiện đại, responsive và tích hợp với API backend thật.

## Tính Năng Chính

### 🔐 Phân Quyền và Bảo Mật
- **JWT Token Authentication**: Sử dụng JWT token để xác thực và phân quyền
- **Role-based Access Control**: Chỉ admin mới có thể truy cập admin panel
- **Automatic Redirect**: Tự động chuyển hướng dựa trên role sau khi đăng nhập
- **Protected Routes**: Tất cả route admin đều được bảo vệ

### 🎨 Giao Diện Hiện Đại
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Modern UI**: Thiết kế theo xu hướng hiện đại với animations mượt mà
- **Dark/Light Theme**: Hỗ trợ chế độ tối/sáng
- **Loading States**: Hiển thị trạng thái loading khi tải dữ liệu
- **Error Handling**: Xử lý lỗi một cách thân thiện với người dùng

## Cấu Trúc Admin Panel

### 📁 Thư Mục
```
src/
├── pages/Admin/
│   ├── Dashboard/
│   ├── Products/
│   ├── Categories/
│   ├── Brands/
│   ├── Bills/
│   ├── Promotions/
│   └── Users/
├── components/AdminSidebar/
├── layouts/AdminLayout/
└── routes/AdminProtectedRoute/
```

### 🔧 Services API
- **productService.ts**: Quản lý sản phẩm (CRUD)
- **categoryService.ts**: Quản lý danh mục (CRUD)
- **brandService.ts**: Quản lý thương hiệu (CRUD)
- **orderService.ts**: Quản lý đơn hàng
- **userService.ts**: Quản lý người dùng

## Các Trang Quản Lý

### 🛍️ Quản Lý Sản Phẩm (`/admin/products`)
**API Endpoints:**
- `GET /api/products` - Lấy tất cả sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

**Tính năng:**
- ✅ Hiển thị danh sách sản phẩm từ API thật
- ✅ Thêm sản phẩm mới với form validation
- ✅ Chỉnh sửa thông tin sản phẩm
- ✅ Xóa sản phẩm với confirmation
- ✅ Tìm kiếm và lọc theo danh mục, thương hiệu, trạng thái
- ✅ Hiển thị hình ảnh, giá, số lượng tồn kho
- ✅ Modal form cho thêm/sửa sản phẩm

**Form Fields:**
- Tên sản phẩm (productName)
- Giá (price)
- Slug (slug)
- Số lượng (quantity)
- Giá vốn (unitCost)
- Tổng tiền (totalAmount)
- Thương hiệu (brandId)
- URL hình ảnh (imageUrl)
- Trạng thái (status)

### 📂 Quản Lý Danh Mục (`/admin/categories`)
**API Endpoints:**
- `GET /api/categories` - Lấy tất cả danh mục
- `POST /api/categories` - Tạo danh mục mới
- `PUT /api/categories/:id` - Cập nhật danh mục
- `DELETE /api/categories/:id` - Xóa danh mục

**Tính năng:**
- ✅ Hiển thị danh sách danh mục từ API thật
- ✅ Thêm danh mục mới
- ✅ Chỉnh sửa danh mục
- ✅ Xóa danh mục với confirmation
- ✅ Tìm kiếm theo tên hoặc slug
- ✅ Hiển thị số lượng danh mục con

**Form Fields:**
- Tên danh mục (categoryName)
- Slug (slug)

### 🏷️ Quản Lý Thương Hiệu (`/admin/brands`)
**API Endpoints:**
- `GET /api/brands` - Lấy tất cả thương hiệu
- `POST /api/brands` - Tạo thương hiệu mới
- `PUT /api/brands/:id` - Cập nhật thương hiệu
- `DELETE /api/brands/:id` - Xóa thương hiệu

**Tính năng:**
- ✅ Hiển thị danh sách thương hiệu từ API thật
- ✅ Thêm thương hiệu mới
- ✅ Chỉnh sửa thương hiệu
- ✅ Xóa thương hiệu với confirmation
- ✅ Tìm kiếm theo tên hoặc slug

**Form Fields:**
- Tên thương hiệu (brandName)
- Slug (slug)

### 📊 Dashboard (`/admin/dashboard`)
**Tính năng:**
- ✅ Thống kê tổng quan
- ✅ Biểu đồ doanh thu
- ✅ Danh sách đơn hàng gần đây
- ✅ Top sản phẩm bán chạy
- ✅ Thông báo hệ thống

### 👥 Quản Lý Người Dùng (`/admin/users`)
**Tính năng:**
- ✅ Danh sách người dùng
- ✅ Quản lý quyền hạn
- ✅ Thống kê hoạt động
- ✅ Khóa/mở khóa tài khoản

### 🧾 Quản Lý Đơn Hàng (`/admin/bills`)
**Tính năng:**
- ✅ Danh sách đơn hàng
- ✅ Chi tiết đơn hàng
- ✅ Cập nhật trạng thái
- ✅ Xuất hóa đơn

### 🎁 Quản Lý Khuyến Mãi (`/admin/promotions`)
**Tính năng:**
- ✅ Danh sách khuyến mãi
- ✅ Tạo khuyến mãi mới
- ✅ Cấu hình điều kiện
- ✅ Theo dõi hiệu quả

## Công Cụ Debug

### 🔍 Token Debugger
- Hiển thị thông tin JWT token
- Kiểm tra role và quyền hạn
- Debug thông tin user
- Hỗ trợ cả "admin" và "ADMIN" role

### 📱 Redirect Notification
- Thông báo chuyển hướng với countdown
- Hiển thị role và đường dẫn đích
- Animation mượt mà

## Hướng Dẫn Sử Dụng

### 1. Đăng Nhập Admin
```typescript
// Sử dụng tài khoản có role "admin" hoặc "ADMIN"
const adminCredentials = {
  username: "admin",
  password: "admin123"
};
```

### 2. Truy Cập Admin Panel
- Sau khi đăng nhập thành công, hệ thống sẽ tự động chuyển hướng đến `/admin/dashboard`
- Nếu không có quyền admin, sẽ chuyển hướng về trang chủ

### 3. Quản Lý Dữ Liệu
- **Thêm mới**: Click nút "+" để mở modal form
- **Chỉnh sửa**: Click nút "Sửa" trên item
- **Xóa**: Click nút "Xóa" và xác nhận
- **Tìm kiếm**: Sử dụng thanh tìm kiếm
- **Lọc**: Sử dụng dropdown filters

### 4. Responsive Design
- **Desktop**: Hiển thị đầy đủ sidebar và content
- **Tablet**: Sidebar có thể thu gọn
- **Mobile**: Sidebar ẩn, hiển thị menu hamburger

## API Integration

### Cấu Hình API
```typescript
// src/services/axiosInstance.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
```

### Error Handling
- Hiển thị thông báo lỗi thân thiện
- Retry mechanism cho network errors
- Loading states cho tất cả API calls

### Data Validation
- Form validation client-side
- API response validation
- Type safety với TypeScript

## Bảo Mật

### JWT Token Management
```typescript
// Tự động lấy role từ JWT token
const userRole = getRoleFromToken(accessToken);
if (userRole === 'admin' || userRole === 'ADMIN') {
  // Cho phép truy cập admin panel
}
```

### Route Protection
```typescript
// Tất cả route admin đều được bảo vệ
<AdminProtectedRoute path="/admin/*" element={<AdminLayout />} />
```

## Troubleshooting

### Lỗi Thường Gặp
1. **Không thể truy cập admin panel**
   - Kiểm tra role trong JWT token
   - Đảm bảo đã đăng nhập với tài khoản admin

2. **API không hoạt động**
   - Kiểm tra server backend có đang chạy không
   - Kiểm tra URL API trong environment variables

3. **Dữ liệu không load**
   - Kiểm tra network connection
   - Xem console log để debug

### Debug Tools
- **Token Debugger**: Hiển thị trong admin layout
- **Console Logs**: Chi tiết lỗi API
- **Network Tab**: Kiểm tra API requests

## Cập Nhật Mới Nhất

### ✅ Đã Hoàn Thành
- [x] Tích hợp API thật cho Products, Categories, Brands
- [x] CRUD operations hoàn chỉnh
- [x] Form validation và error handling
- [x] Modal forms cho thêm/sửa
- [x] Loading states và error states
- [x] Responsive design
- [x] JWT token authentication
- [x] Role-based access control
- [x] Automatic redirect sau đăng nhập
- [x] Debug tools

### 🚧 Đang Phát Triển
- [ ] Quản lý đơn hàng (Bills)
- [ ] Quản lý khuyến mãi (Promotions)
- [ ] Quản lý người dùng (Users)
- [ ] Dashboard với thống kê thật
- [ ] Export/Import dữ liệu
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] Real-time notifications

## Kết Luận
Admin Panel đã được tích hợp hoàn toàn với API backend thật, cung cấp giao diện quản lý hiện đại và đầy đủ tính năng cho việc quản lý siêu thị. Hệ thống đảm bảo bảo mật, hiệu suất và trải nghiệm người dùng tốt. 