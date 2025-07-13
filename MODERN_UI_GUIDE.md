# Hướng Dẫn Sử Dụng Modern UI Components

## Tổng Quan

Dự án đã được cập nhật với bộ giao diện hiện đại hoàn toàn mới cho các form đăng nhập và đăng ký. Các component mới bao gồm:

- **ModernAuth**: Container chính cho giao diện đăng nhập/đăng ký
- **ModernInput**: Input field với thiết kế hiện đại
- **ModernButton**: Button với nhiều variant và animation

## Các Component Mới

### 1. ModernAuth

Component container chính cho giao diện đăng nhập/đăng ký với thiết kế hiện đại.

#### Props:
```typescript
interface ModernAuthProps {
  type: 'login' | 'register';
  children: React.ReactNode;
  title: string;
  subtitle: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}
```

#### Sử dụng:
```tsx
import { ModernAuth } from '../../components';

<ModernAuth
  type="login"
  title="Đăng Nhập"
  subtitle="Chào mừng bạn quay trở lại!"
  switchText="Chưa có tài khoản?"
  switchLink="/auth/register"
  switchLinkText="Đăng ký ngay"
>
  <LoginForm />
</ModernAuth>
```

#### Tính năng:
- Background animation với floating shapes
- Gradient background đẹp mắt
- Responsive design hoàn chỉnh
- Brand section với logo và features
- Social login buttons (Google, Facebook)
- Smooth transitions và hover effects

### 2. ModernInput

Input field với thiết kế hiện đại, hỗ trợ nhiều loại input.

#### Props:
```typescript
interface ModernInputProps {
  id?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'select';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  select?: boolean;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
  min?: string;
  max?: string;
}
```

#### Sử dụng:
```tsx
import { ModernInput } from '../../components';

// Text input
<ModernInput
  name="username"
  label="Tên đăng nhập"
  value={formData.username || ''}
  onChange={handleInputChange}
  error={errors.username}
  required
  placeholder="Nhập tên đăng nhập"
/>

// Password input (có toggle)
<ModernInput
  name="password"
  type="password"
  label="Mật khẩu"
  value={formData.password || ''}
  onChange={handleInputChange}
  error={errors.password}
  required
  placeholder="Nhập mật khẩu"
/>

// Select input
<ModernInput
  name="country"
  label="Quốc gia"
  value={formData.country || ''}
  onChange={handleInputChange}
  error={errors.country}
  select
  options={countryOptions}
  required
/>
```

#### Tính năng:
- Password toggle button tích hợp
- Error states với animation
- Focus states với glow effect
- Select dropdown với custom arrow
- Responsive design
- Dark mode support
- Accessibility features

### 3. ModernButton

Button component với nhiều variant và animation.

#### Props:
```typescript
interface ModernButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
```

#### Sử dụng:
```tsx
import { ModernButton } from '../../components';

// Primary button
<ModernButton
  type="submit"
  variant="primary"
  size="lg"
  fullWidth
  loading={loading}
>
  Đăng nhập
</ModernButton>

// Button với icon
<ModernButton
  variant="outline"
  icon={<svg>...</svg>}
  iconPosition="left"
>
  Tiếp tục với Google
</ModernButton>
```

#### Variants:
- **primary**: Gradient blue với shadow
- **secondary**: Gradient gray
- **outline**: Border với hover fill
- **ghost**: Transparent với hover background
- **danger**: Gradient red

#### Sizes:
- **sm**: 36px height
- **md**: 44px height (default)
- **lg**: 52px height

#### Tính năng:
- Loading state với spinner
- Ripple effect khi click
- Hover animations
- Focus states
- Icon support
- Full width option

## Responsive Design

### Breakpoints:
- **Desktop**: > 1024px - 2 cột layout
- **Tablet**: 768px - 1024px - Stacked layout
- **Mobile**: < 768px - Single column

### Mobile Optimizations:
- Touch-friendly button sizes
- Optimized input padding
- Simplified animations
- Reduced motion support

## Browser Support

### Modern Browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features:
- CSS Grid và Flexbox
- CSS Custom Properties
- Backdrop Filter
- CSS Animations
- Modern CSS Selectors

### Fallbacks:
- Graceful degradation cho older browsers
- Polyfills cho CSS features
- Alternative layouts cho unsupported features

## Performance Optimizations

### CSS:
- Efficient selectors
- Hardware-accelerated animations
- Minimal reflows
- Optimized paint operations

### JavaScript:
- Lazy loading cho components
- Memoized callbacks
- Efficient state updates
- Minimal DOM manipulation

## Accessibility

### WCAG 2.1 AA Compliance:
- Proper color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels và roles

### Features:
- Focus indicators
- Skip links
- Semantic HTML
- Alt text cho images
- Form labels

## Dark Mode Support

Tự động detect và apply dark mode dựa trên system preference:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

## Customization

### CSS Variables:
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #7c3aed;
  --error-color: #ef4444;
  --success-color: #10b981;
  --border-radius: 12px;
  --transition-duration: 0.3s;
}
```

### Theme Override:
```css
.modern-auth-container {
  --primary-color: #your-color;
  --border-radius: 16px;
}
```

## Testing

### Unit Tests:
- Component rendering
- Props validation
- Event handling
- State management

### Integration Tests:
- Form submission
- Validation flow
- Navigation
- API integration

### E2E Tests:
- User workflows
- Cross-browser compatibility
- Responsive behavior
- Accessibility

## Troubleshooting

### Common Issues:

1. **Input không hiển thị đúng**
   - Kiểm tra value prop có undefined không
   - Đảm bảo onChange handler được truyền đúng

2. **Button không responsive**
   - Kiểm tra CSS classes
   - Đảm bảo variant và size props đúng

3. **Animation không chạy**
   - Kiểm tra browser support
   - Disable reduced motion nếu cần

4. **Dark mode không hoạt động**
   - Kiểm tra system preference
   - Đảm bảo CSS variables được set

### Debug Mode:
```tsx
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('ModernAuth props:', props);
}
```

## Migration Guide

### Từ ResponsiveAuth sang ModernAuth:

1. **Import thay đổi:**
```tsx
// Cũ
import ResponsiveAuth from '../../components/ResponsiveAuth';

// Mới
import { ModernAuth } from '../../components';
```

2. **Props giữ nguyên:**
```tsx
<ModernAuth
  type="login"
  title="Đăng Nhập"
  subtitle="Chào mừng bạn quay trở lại!"
  switchText="Chưa có tài khoản?"
  switchLink="/auth/register"
  switchLinkText="Đăng ký ngay"
>
  <LoginForm />
</ModernAuth>
```

### Từ Input sang ModernInput:

1. **Import thay đổi:**
```tsx
// Cũ
import { Input } from '../../components';

// Mới
import { ModernInput } from '../../components';
```

2. **Props cập nhật:**
```tsx
// Cũ
<Input
  name="username"
  label="Tên đăng nhập *"
  value={formData.username}
  onChange={handleInputChange}
  error={errors.username}
/>

// Mới
<ModernInput
  name="username"
  label="Tên đăng nhập"
  value={formData.username || ''}
  onChange={handleInputChange}
  error={errors.username}
  required
  placeholder="Nhập tên đăng nhập"
/>
```

### Từ Button sang ModernButton:

1. **Import thay đổi:**
```tsx
// Cũ
import { Button } from '../../components';

// Mới
import { ModernButton } from '../../components';
```

2. **Props cập nhật:**
```tsx
// Cũ
<Button type="submit" className="auth-submit-btn w-100" disabled={loading}>
  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
</Button>

// Mới
<ModernButton
  type="submit"
  variant="primary"
  size="lg"
  fullWidth
  loading={loading}
  disabled={loading}
>
  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
</ModernButton>
```

## Future Enhancements

### Planned Features:
- Theme switcher (light/dark toggle)
- Custom color schemes
- Animation presets
- Advanced form validation
- Multi-step forms
- File upload support
- Rich text editor

### Performance Improvements:
- CSS-in-JS optimization
- Bundle size reduction
- Tree shaking support
- Lazy loading improvements
- Caching strategies

## Support

Nếu gặp vấn đề hoặc cần hỗ trợ:

1. Kiểm tra documentation này
2. Xem examples trong codebase
3. Tạo issue với detailed description
4. Contact development team

---

**Lưu ý**: Đây là phiên bản beta của Modern UI. Một số tính năng có thể thay đổi trong các phiên bản tương lai. 