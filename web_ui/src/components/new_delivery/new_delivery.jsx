import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Model from '../model/model';
import DateTime from '../datetime/datetime';
import AddressMap from '../address_map/address_map';
import Packaging from '../packaging/packaging';
import CargoType from '../cargo_type/cargo_type';
import Services from '../services/services';
import { useApplication } from '../../context/ApplicationContext';

const steps = [
    'Модель и номер',
    'Дата и время',
    'Адреса и координаты',
    'Упаковка',
    'Тип груза',
    'Услуги'
];

const NewDelivery = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const { handleSubmit, loading, error, resetForm } = useApplication();

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
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
                return <CargoType />;
            case 5:
                return <Services />;
            default:
                return 'Неизвестный шаг';
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Новая доставка
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Создать доставку'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            Далее
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default NewDelivery;