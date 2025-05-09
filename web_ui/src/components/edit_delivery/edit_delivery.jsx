import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Model from '../model/model';
import DateTime from '../datetime/datetime';
import AddressMap from '../address_map/address_map';
import Packaging from '../packaging/packaging';
import Services from '../services/services';
import { useApplication } from '../../context/ApplicationContext';

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
    const [activeStep, setActiveStep] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { applicationData, updateFormData, submitAllData } = useApplication();

    useEffect(() => {
        // Здесь будет загрузка данных доставки по id
        // Пример:
        // const fetchDelivery = async () => {
        //     const data = await api.getDelivery(id);
        //     // Обновляем данные в контексте
        //     updateFormData('modelData', {
        //         model: data.model,
        //         number: data.number
        //     });
        //     updateFormData('dateTimeData', {
        //         departureDateTime: data.departureDateTime,
        //         arrivalDateTime: data.arrivalDateTime,
        //         travelTime: data.travelTime
        //     });
        //     updateFormData('addressData', {
        //         fromAddress: data.fromAddress,
        //         toAddress: data.toAddress,
        //         distance: data.distance
        //     });
        //     updateFormData('packagingData', {
        //         packaging: data.packaging
        //     });
        //     updateFormData('servicesData', {
        //         services: data.services
        //     });
        // };
        // fetchDelivery();
    }, [id]);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        submitAllData();
        navigate('/'); // Возврат к списку доставок после сохранения
    };

    const handleDelete = () => {
        // Здесь будет логика удаления доставки
        setDeleteDialogOpen(false);
        navigate('/'); // Возврат к списку доставок после удаления
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
                return 'Неизвестный шаг';
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Редактирование доставки
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 4 }}>
                {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Назад
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Удалить
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Сохранить изменения
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                        >
                            Далее
                        </Button>
                    )}
                </Box>
            </Box>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    Вы уверены, что хотите удалить эту доставку?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditDelivery; 