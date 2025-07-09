import { useRoutes } from 'react-router-dom';
import routes from './routes';
import './App.css'
import { useCartSync } from './stores/cartStore';

function App() {
  const element = useRoutes(routes);
  
  useCartSync();
  
  return (
    <>
      {element}
    </>
  );
}

export default App
