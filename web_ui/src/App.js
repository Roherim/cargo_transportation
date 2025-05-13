import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider } from './context/AuthContext';
import darkTheme from './theme';
import Navigation from './components/navigation/navigation';
import Auth from './components/auth/auth';
import NewDelivery from './components/new_delivery/new_delivery';
import EditDelivery from './components/edit_delivery/edit_delivery';
import DeliveryList from './components/delivery_list/delivery_list';
import ClientList from './components/clients/ClientList';
import ClientDetails from './components/clients/ClientDetails';
import DeliveryReport from './components/delivery_report/DeliveryReport';
import PrivetRoutes from './components/privet_routes.jsx';

function App() {
  const [link, setLink] = useState(() => {
    const savedLink = localStorage.getItem('link');
    return savedLink === null ? '/login' : savedLink;
  });

  const location = useLocation();
  console.log('App: Текущий маршрут:', location.pathname); // Отладка

  useEffect(() => {
    localStorage.setItem('link', link);
  }, [link]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <ApplicationProvider>
          <Navigation /> 
          <Routes>
            <Route path="/login" element={<Auth link={link} setLink={setLink} />} />
            <Route element={<PrivetRoutes link={link} />}>
              <Route index element={<DeliveryList />} />
              <Route path="new_delivery" element={<NewDelivery />} />
              <Route path="delivery/:id" element={<EditDelivery />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/:id" element={<ClientDetails />} />
              <Route path="report" element={<DeliveryReport />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ApplicationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;