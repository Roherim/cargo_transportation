import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import darkTheme from './theme';
import Navigation from './components/navigation/navigation';

// Компоненты страниц
import Auth from './components/auth/auth';
import NewDelivery from './components/new_delivery/new_delivery';
import EditDelivery from './components/edit_delivery/edit_delivery';
import DeliveryList from './components/delivery_list/delivery_list';
import AddressMap from './components/address_map/address_map';
import Packaging from './components/packaging/packaging';
import Services from './components/services/services';
import DateTime from './components/datetime/datetime';
import Model from './components/model/model';
import ClientList from './components/clients/ClientList';
import ClientDetails from './components/clients/ClientDetails';
import DeliveryReport from './components/delivery_report/DeliveryReport';
import PrivetRoutes from './components/privet_routes.jsx';  
import { useState } from 'react';
/**
 * Главный компонент приложения
 * Определяет маршрутизацию и оборачивает приложение в контекст
 */

function App() {
  const [link, setLink] = useState(localStorage.getItem('link') === null ? '/login' : localStorage.getItem('link'))
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Route path="/login" element={<Auth link={link} setLink={setLink}/>} />
      <PrivetRoutes link={link} >
        <ApplicationProvider>
          <Routes>
            {/* Публичные маршруты */}
            

            {/* Защищенные маршруты */}
            <Route path="/" element={
             
                <Navigation />
            
            }>
              <Route index element={<DeliveryList />} />
              <Route path="new_delivery" element={<NewDelivery />} />
              <Route path="delivery/:id" element={<EditDelivery />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/:id" element={<ClientDetails />} />
              <Route path="report" element={<DeliveryReport />} />
            </Route>

            {/* Перенаправление несуществующих маршрутов на логин */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ApplicationProvider>
      </PrivetRoutes>
    </ThemeProvider>
  );
}

export default App;
