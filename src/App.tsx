import { useRoutes } from 'react-router-dom';
import routes from './routes';
import './App.css'
import { useCartSync } from './stores/cartStore';
import { useEffect } from 'react';

function App() {
  const element = useRoutes(routes);
  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

    localStorage.setItem = function (key, value) {
      const event = new Event("localstorage_updated");
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(event);
    };

    localStorage.removeItem = function (key) {
      const event = new Event("localstorage_updated");
      originalRemoveItem.apply(this, [key]);
      window.dispatchEvent(event);
    };

    localStorage.clear = function () {
      const event = new Event("localstorage_updated");
      originalClear.apply(this);
      window.dispatchEvent(event);
    };

    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
      localStorage.clear = originalClear;
    };
  }, []);


  useCartSync();

  return (
    <>
      {element}
    </>
  );
}

export default App
