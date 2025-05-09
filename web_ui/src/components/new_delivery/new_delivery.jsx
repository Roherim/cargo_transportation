import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const NewDelivery = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const { submitAllData } = useApplication();

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        try {
       
            const result = submitAllData();
            console.log('Form data:', result);
            navigate('/');
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
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
                Новая доставка
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
                <Box>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Создать доставку
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
        </Box>
    );
};

export default NewDelivery;