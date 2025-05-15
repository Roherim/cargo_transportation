import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Container,
    Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { api } from '../../services/api';
import Model from '../model/model';
import DateTime from '../datetime/datetime';
import AddressMap from '../address_map/address_map';
import Packaging from '../packaging/packaging';
import Services from '../services/services';

const steps = [
    'Модель и номер',
    'Дата и время',
    'Адреса и координаты',
    'Упаковка',
    'Услуги'
];

const EditDelivery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applicationData, updateFormData, handleUpdate, resetForm } = useApplication();
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [saving, setSaving] = useState(false);

    const initializeData = useCallback(async () => {
        if (isInitialized) return;

        try {
            setIsLoading(true);
            console.log('Fetching delivery data for id:', id);
            const data = await api.getDelivery(id);
            console.log('Received delivery data:', data);

            if (data) {
                const formattedData = {
                    modelData: {
                        model: data.transport_model.id,
                        number: data.transport_number
                    },
                    dateTimeData: {
                        departure_date: data.date,
                        departure_time: data.time,
                        arrival_date: data.arrival_date,
                        arrival_time: data.arrival_time,
                        travel_time: data.travel_time
                    },
                    addressData: {
                        pickup_address: data.pickup_address,
                        delivery_address: data.delivery_address,
                        distance: data.distance
                    },
                    packagingData: {
                        packaging: data.packaging_type.id
                    },
                    servicesData: {
                        services: data.services
                    }
                };
                console.log('Formatted data:', formattedData);

                updateFormData('modelData', formattedData.modelData);
                updateFormData('datetimeData', formattedData.dateTimeData);
                updateFormData('addressData', formattedData.addressData);
                updateFormData('packagingData', formattedData.packagingData);
                updateFormData('servicesData', formattedData.servicesData);
                setIsInitialized(true);
            }
        } catch (error) {
            console.error('Error fetching delivery:', error);
            setError('Ошибка при загрузке данных доставки');
        } finally {
            setIsLoading(false);
        }
    }, [id, updateFormData, isInitialized]);

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSave = async () => {
        try {
            console.log('Starting save process...');
            console.log('Current application data:', applicationData);
            setSaving(true);
    
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
                throw new Error('Выберите дату прибытия');
            }
            if (!applicationData.datetimeData?.arrival_time) {
                throw new Error('Выберите время прибытия');
            }
            if (!applicationData.datetimeData?.travel_time) {
                throw new Error('Введите время в пути');
            }
    
            const success = await handleUpdate(id);
            console.log('Save result:', success);
            if (success) {
                resetForm(); // Переносим resetForm сюда
                navigate('/deliveries');
            }
        } catch (error) {
            console.error('Error saving delivery:', error);
            setError('Ошибка при сохранении изменений');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await api.deleteDelivery(id);
            navigate('/deliveries');
        } catch (error) {
            console.error('Error deleting delivery:', error);
            setError('Ошибка при удалении доставки');
        } finally {
            setIsLoading(false);
            setShowConfirmDialog(false);
        }
        resetForm()
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <Model />;
            case 1:
                return <DateTime />;
            case 2:
                return <AddressMap />;
            case 3:
                return <Packaging />;
            case 4:
                return <Services />;
            default:
                return null;
        }
    };

    const isStepComplete = (step) => {
        switch (step) {
            case 0:
                return applicationData.modelData?.model && applicationData.modelData?.number;
            case 1:
                return applicationData.datetimeData?.departure_date &&
                    applicationData.datetimeData?.departure_time &&
                    applicationData.datetimeData?.arrival_date &&
                    applicationData.datetimeData?.arrival_time &&
                    applicationData.datetimeData?.travel_time;
            case 2:
                return applicationData.addressData?.pickup_address &&
                    applicationData.addressData?.delivery_address;
            case 3:
                return applicationData.packagingData?.packaging;
            case 4:
                return applicationData.servicesData?.services?.length > 0;
            default:
                return false;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#1a237e', fontWeight: 600 }}>
                Редактирование доставки
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mt: 2, mb: 4 }}>
                {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ mr: 1 }}
                >
                    Назад
                </Button>
                <Box>
                    {activeStep === steps.length - 1 ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={saving}
                                sx={{ mr: 1 }}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Сохранить'}
                            </Button>

                        </>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!isStepComplete(activeStep)}
                        >
                            Далее
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {api.deliveryRegister(id ); navigate('/');}}
                        sx={{ ml: 1 }}
                    >
                        Провести
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setShowConfirmDialog(true)}
                        sx={{ ml: 1 }}
                    >
                        Удалить
                    </Button>
                    
                </Box>
            </Box>

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить эту доставку? Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditDelivery; 