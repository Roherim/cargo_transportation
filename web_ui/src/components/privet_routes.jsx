// components/privet_routes.jsx
import { Navigate, Outlet } from 'react-router-dom';

const PrivetRoutes = ({ link }) => {
  const logged = localStorage.getItem('logged');
  console.log('PrivetRoutes: logged =', logged);

  if (logged !== 'true') {
    console.log('PrivetRoutes: Перенаправление на /login');
    return <Navigate to="/login" replace />;
  }
  console.log('PrivetRoutes: Рендеринг защищённых маршрутов');
  return <Outlet />; // Явно возвращаем Outlet для рендера вложенных маршрутов
};

export default PrivetRoutes;