import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';

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
    <ApplicationProvider>
      <Routes>
        {/* Основные маршруты */}
        <Route path="/" element={<DeliveryList />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/new_delivery" element={<NewDelivery />} />
        <Route path="/delivery/:id" element={<EditDelivery />} />

      </Routes>
    </ApplicationProvider>
  );
}

export default App;
