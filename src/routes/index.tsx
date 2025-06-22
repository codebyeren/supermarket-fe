import { Home, Login, Register, Dashboard } from '../pages'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

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
      {
        path: 'dashboard',
        element: <Dashboard />
      }
      // Add other main pages here
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
      }
      // Add other auth pages like forgot-password here
    ]
  }
]

export default routes 