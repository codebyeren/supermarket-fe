import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/authUtils';

export const useLoginRedirect = () => {
  const navigate = useNavigate();

  const redirectAfterLogin = () => {
    // Kiểm tra role từ JWT token và redirect
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const redirectToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const redirectToUser = () => {
    navigate('/');
  };

  return {
    redirectAfterLogin,
    redirectToAdmin,
    redirectToUser
  };
}; 