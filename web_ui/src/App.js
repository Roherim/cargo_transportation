import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApplicationProvider } from './context/ApplicationContext';
import darkTheme from './theme';

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

/**
 * Главный компонент приложения
 * Определяет маршрутизацию и оборачивает приложение в контекст
 */
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ApplicationProvider>
        <Routes>
          {/* Основные маршруты */}
          <Route path="/" element={<DeliveryList />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/new_delivery" element={<NewDelivery />} />
          <Route path="/delivery/:id" element={<EditDelivery />} />
        </Routes>
      </ApplicationProvider>
    </ThemeProvider>
  );
}

export default App;
