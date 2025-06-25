import { Home, Login, Register, Dashboard } from '../pages'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProductDetail from '../pages/ProductDetail'
import About from '../pages/About'
import Contact from '../pages/Contact'


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
      },
      {
        path : "/product/:slug",
        element : <ProductDetail />
      },
       {
        path : "/about",
        element : <About />
      },
       {
        path : "/contact",
        element : <Contact />
      }

    // Example for products page

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