import { Home, Login, Register } from '../pages'
import { Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProductDetail from '../pages/ProductDetail'
import About from '../pages/About'
import Contact from '../pages/Contact'
import CategoryPage from "../pages/Category";
import SearchPage from "../pages/Search";
import Favorites from '../pages/Favorites'
import ProtectedRoute from './ProtectedRoute'
import AdminProtectedRoute from './AdminProtectedRoute'
import UserInfoPage from '../pages/UserInfo'
import CartPage from '../pages/Cart'
import CheckoutPage from '../pages/Checkout'
import OrderHistoryPage from '../pages/OrderHistory'
import ForgotPasswordPage from '../pages/ForgotPassword/ResetPass'
import ForgotStep1_SendEmail from '../pages/ForgotPassword/ForgotPass'
import ForgotStep2_VerifyCode from '../pages/ForgotPassword/VerifyCode'
import ForgotStep3_ResetPassword from '../pages/ForgotPassword/ResetPass'

// Admin pages
// import AdminDashboard from '../pages/Admin/Dashboard'
import AdminUsers from '../pages/Admin/Users'
import AdminProducts from '../pages/Admin/Products'
import AdminCategories from '../pages/Admin/Categories'
import AdminBrands from '../pages/Admin/Brands'
import AdminBills from '../pages/Admin/Bills'
import AdminPromotions from '../pages/Admin/Promotions'


const routes = [
  // Routes for main layout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // {
      //   path: 'dashboard',
      //   element: <Dashboard />
      // },
      {
        path: "/product/:slug",
        element: <ProductDetail />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: '/category/:slug',
        element: <CategoryPage />
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/favorites',
        element: <ProtectedRoute><Favorites /></ProtectedRoute>
      },
      {
        path: '/user-info',
        element: <ProtectedRoute><UserInfoPage /></ProtectedRoute>
      },
      {
        path: '/order-history',
        element: <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
      },
      {
        path: '/cart',
        element: <ProtectedRoute><CartPage /></ProtectedRoute>
      },
      {
        path : '/checkout',
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
      }
    ]
  },
  // Routes for auth layout
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },

      {
        path: 'forgot-password',
        element: <ForgotStep1_SendEmail />
      },
      {
        path: 'verify-code',
        element: <ForgotStep2_VerifyCode />
      },
      {
        path: 'reset-password',
        element: <ForgotStep3_ResetPassword />
      },

      // Add other auth pages like forgot-password here
    ]
  },
  // Routes for admin layout
  {
    path: '/admin',
    element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/users" replace />
      },
      // {
      //   path: 'dashboard',
      //   element: <AdminDashboard />
      // },
      {
        path: 'users',
        element: <AdminUsers />
      },
      {
        path: 'products',
        element: <AdminProducts />
      },
      {
        path: 'categories',
        element: <AdminCategories />
      },
      {
        path: 'brands',
        element: <AdminBrands />
      },
      {
        path: 'bills',
        element: <AdminBills />
      },
      {
        path: 'promotions',
        element: <AdminPromotions />
      }
    ]
  }
]

export default routes 