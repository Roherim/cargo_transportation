import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, TextField, MenuItem } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';

const MODELS = [
    'V01',
    'X20',
    'REX',
    'Спринтер',
    'Газель',
    'Лада Груз',
    'ЭлектроМобиль'
];

const Model = () => {
    const { applicationData, updateFormData } = useApplication();
    const [selectedModel, setSelectedModel] = useState(applicationData.modelData.model || '');
    const [number, setNumber] = useState(applicationData.modelData.number || '');

    useEffect(() => {
        updateFormData('modelData', {
            model: selectedModel,
            number: number
        });
    }, [selectedModel, number]);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Box component="h4" sx={{ mb: 3, color: 'text.primary' }}>
                Выбор модели и номера
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Модель</FormLabel>
                <TextField
                    select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    fullWidth
                >
                    {MODELS.map((model) => (
                        <MenuItem key={model} value={model}>
                            {model}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Номер</FormLabel>
                <TextField
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    fullWidth
                    placeholder="Введите номер"
                />
            </FormControl>
        </Box>
    );
};

export default Model; 