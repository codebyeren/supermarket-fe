import { useRoutes } from 'react-router-dom';
import routes from './routes';
import './App.css'
import { Footer } from './components';
import { useCartSync } from './stores/cartStore';

function App() {
  const element = useRoutes(routes);
  
  // Khởi tạo cart sync để load dữ liệu từ localStorage
  useCartSync();
  
  return (
    <>
      {element}
    </>
  );
}

export default App
