import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const [applicationData, setApplicationData] = useState({
        modelData: {
            model: '',
            number: ''
        },
        addressData: {
            pickup_address: '',
            delivery_address: '',
            distance: ''
        },
        datetimeData: {
            departure_date: '',
            departure_time: '',
            arrival_date: '',
            arrival_time: '',
            travel_time: ''
        },
        packagingData: {
            packaging: ''
        },
        servicesData: {
            services: []
        },
        cargoData: {
            cargo_type: ''
        }
    });

    const resetForm = () => {
        setApplicationData({
            modelData: {
                model: '',
                number: ''
            },
            addressData: {
                pickup_address: '',
                delivery_address: '',
                distance: ''
            },
            datetimeData: {
                departure_date: '',
                departure_time: '',
                arrival_date: '',
                arrival_time: '',
                travel_time: ''
            },
            packagingData: {
                packaging: ''
            },
            servicesData: {
                services: []
            },
            cargoData: {
                cargo_type: ''
            }
        });
    };

    const updateFormData = (formName, data) => {
        setApplicationData(prev => ({
            ...prev,
            [formName]: {
                ...prev[formName],
                ...data
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            // Проверяем наличие всех необходимых данных
            if (!applicationData.modelData?.model) {
                throw new Error('Выберите модель транспорта');
            }
            if (!applicationData.modelData?.number) {
                throw new Error('Введите номер транспорта');
            }
            if (!applicationData.addressData?.pickup_address) {
                throw new Error('Введите адрес отправления');
            }
            if (!applicationData.addressData?.delivery_address) {
                throw new Error('Введите адрес доставки');
            }
            if (!applicationData.addressData?.distance) {
                throw new Error('Введите расстояние');
            }
            if (!applicationData.packagingData?.packaging) {
                throw new Error('Выберите тип упаковки');
            }
            if (!applicationData.cargoData?.cargo_type) {
                throw new Error('Выберите тип груза');
            }
            if (!applicationData.datetimeData?.departure_date) {
                throw new Error('Выберите дату отправления');
            }
            if (!applicationData.datetimeData?.departure_time) {
                throw new Error('Выберите время отправления');
            }
            if (!applicationData.datetimeData?.arrival_date) {
                throw new Error('Выберите дату прибытия');
            }
            if (!applicationData.datetimeData?.arrival_time) {
                throw new Error('Выберите время прибытия');
            }
            if (!applicationData.datetimeData?.travel_time) {
                throw new Error('Введите время в пути');
            }
    
            const deliveryData = {
                transport_model: Number(applicationData.modelData.model),
                transport_number: applicationData.modelData.number,
                pickup_address: applicationData.addressData.pickup_address,
                delivery_address: applicationData.addressData.delivery_address,
                distance: Number(applicationData.addressData.distance),
                packaging_type: Number(applicationData.packagingData.packaging),
                cargo_type: Number(applicationData.cargoData.cargo_type),
                services: applicationData.servicesData.services.map(Number),
                departure_date: applicationData.datetimeData.departure_date,
                departure_time: applicationData.datetimeData.departure_time,
                arrival_date: applicationData.datetimeData.arrival_date,
                arrival_time: applicationData.datetimeData.arrival_time,
                travel_time: Number(applicationData.datetimeData.travel_time)
            };
    
            const file = applicationData.addressData?.file || null;
    
            console.log('Sending delivery data:', deliveryData);
            console.log('File to upload:', file ? file.name : 'No file');
            const response = await api.createDelivery(deliveryData, file);
            console.log('Server response:', response);
    
            if (response.error) {
                throw new Error(response.error);
            }
    
            // Сбрасываем форму после успешного создания
            resetForm();
            navigate('/deliveries');
        } catch (error) {
            console.error('Error creating delivery:', error);
            setError(error.message || 'Ошибка при создании доставки');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (deliveryId) => {
        try {
            setLoading(true);
            setError(null);
    
            // Проверяем наличие всех необходимых данных
            if (!applicationData.modelData?.model) {
                throw new Error('Выберите модель транспорта');
            }
            if (!applicationData.modelData?.number) {
                throw new Error('Введите номер транспорта');
            }
            if (!applicationData.addressData?.pickup_address) {
                throw new Error('Введите адрес отправления');
            }
            if (!applicationData.addressData?.delivery_address) {
                throw new Error('Введите адрес доставки');
            }
            if (!applicationData.addressData?.distance) {
                throw new Error('Введите расстояние'); // Исправляем сообщение
            }
            if (!applicationData.packagingData?.packaging) {
                throw new Error('Выберите тип упаковки');
            }
            if (!applicationData.servicesData?.services?.length) {
                throw new Error('Выберите хотя бы одну услугу');
            }
            if (!applicationData.datetimeData?.departure_date) {
                throw new Error('Выберите дату отправления');
            }
            if (!applicationData.datetimeData?.departure_time) {
                throw new Error('Выберите время отправления');
            }
            if (!applicationData.datetimeData?.arrival_date) {
                throw new Error('Выберите дату прибытия'); // Исправляем сообщение
            }
            if (!applicationData.datetimeData?.arrival_time) {
                throw new Error('Выберите время прибытия');
            }
            if (!applicationData.datetimeData?.travel_time) {
                throw new Error('Введите время в пути');
            }
    
            // Формируем данные для отправки
            const deliveryData = {
                transport_model: Number(applicationData.modelData.model),
                transport_number: applicationData.modelData.number,
                pickup_address: applicationData.addressData.pickup_address,
                delivery_address: applicationData.addressData.delivery_address,
                distance: Number(applicationData.addressData.distance),
                packaging_type: Number(applicationData.packagingData.packaging),
                cargo_type: Number(applicationData.cargoData.cargo_type),
                services: applicationData.servicesData.services.map(Number),
                departure_date: applicationData.datetimeData.departure_date,
                departure_time: applicationData.datetimeData.departure_time,
                arrival_date: applicationData.datetimeData.arrival_date,
                arrival_time: applicationData.datetimeData.arrival_time,
                travel_time: Number(applicationData.datetimeData.travel_time)
            };
    
            const file = applicationData.addressData?.file || null;
    
            console.log('Current application data:', applicationData);
            console.log('Formatted delivery data for update:', deliveryData);
            console.log('File to upload:', file ? file.name : 'No file');
    
            // Отправляем данные на сервер
            const response = await api.updateDelivery(deliveryId, deliveryData, file);
            console.log('Server response:', response);
    
            // Показываем уведомление об успехе
            setNotification({
                open: true,
                message: 'Доставка успешно обновлена',
                severity: 'success'
            });
    
            return true;
        } catch (error) {
            console.error('Error updating delivery:', error);
            setError(error.message);
            setNotification({
                open: true,
                message: error.message,
                severity: 'error'
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ApplicationContext.Provider value={{ 
            applicationData, 
            updateFormData,
            handleSubmit,
            handleUpdate,
            loading,
            error,
            notification,
            setNotification,
            setLoading,
            setError,
            resetForm
        }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
}; 