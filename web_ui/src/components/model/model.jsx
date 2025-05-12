import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    FormControl,
    FormLabel,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';
import { api } from '../../services/api';

const Model = () => {
    const { applicationData, updateFormData } = useApplication();
    const [model, setModel] = useState('');
    const [number, setNumber] = useState('');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const data = await api.getOptions();
                if (data?.transport_models) {
                    setModels(data.transport_models);
                    if (applicationData.modelData?.model) {
                        setModel(applicationData.modelData.model);
                    }
                    if (applicationData.modelData?.number) {
                        setNumber(applicationData.modelData.number);
                    }
                }
            } catch (error) {
                console.error('Error fetching models:', error);
                setError('Ошибка при загрузке моделей транспорта');
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    const handleModelChange = (e) => {
        const newValue = e.target.value;
        setModel(newValue);
        updateFormData('modelData', {
            model: newValue,
            number
        });
    };

    const handleNumberChange = (e) => {
        const newValue = e.target.value;
        setNumber(newValue);
        updateFormData('modelData', {
            model,
            number: newValue
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!models.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="warning">Нет доступных моделей транспорта</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 4, 
                    fontWeight: 600,
                    color: '#1a237e',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    textAlign: 'center',
                }}
            >
                Выбор модели транспорта
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField
                        select
                        label="Модель транспорта"
                        value={model}
                        onChange={handleModelChange}
                        error={!model}
                        helperText={!model ? "Выберите модель транспорта" : ""}
                    >
                        {models.map((model) => (
                            <MenuItem key={model.id} value={model.id}>
                                {model.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>

                <FormControl fullWidth>
                    <TextField
                        label="Номер транспорта"
                        value={number}
                        onChange={handleNumberChange}
                        error={!number}
                        helperText={!number ? "Введите номер транспорта" : ""}
                    />
                </FormControl>
            </Box>
        </Container>
    );
};

export default Model; 