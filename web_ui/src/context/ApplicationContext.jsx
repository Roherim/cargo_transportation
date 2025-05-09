import React, { createContext, useContext, useState } from 'react';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
    const [applicationData, setApplicationData] = useState({
        // Данные формы адресов
        addressData: {
            fromAddress: '',
            toAddress: '',
            distance: 0
        },
        // Данные формы модели
        modelData: {
            model: '',
            number: ''
        },
        // Данные формы даты и времени
        dateTimeData: {
            departureDateTime: '',
            arrivalDateTime: '',
            travelTime: ''
        },
        // Данные формы упаковки
        packagingData: {
            packaging: ''
        },
        // Данные формы услуг
        servicesData: {
            services: []
        }
    });

    const updateFormData = (formName, data) => {
        setApplicationData(prev => ({
            ...prev,
            [formName]: {
                ...prev[formName],
                ...data
            }
        }));
    };

    const submitAllData = () => {
        // Собираем все данные в один объект
        const allData = {
            ...applicationData.addressData,
            ...applicationData.modelData,
            ...applicationData.dateTimeData,
            ...applicationData.packagingData,
            ...applicationData.servicesData,
            status: 'В ожидании',
            technicalCondition: 'Исправно'
        };

        // Выводим в консоль все данные одним JSON-объектом
        

        return allData;
    };

    return (
        <ApplicationContext.Provider value={{ 
            applicationData, 
            updateFormData,
            submitAllData 
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