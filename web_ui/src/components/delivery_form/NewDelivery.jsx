import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const NewDelivery = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({
        statuses: [],
        cargoTypes: [],
        transportModels: [],
        packagingTypes: [],
        services: []
    });

    const [formData, setFormData] = useState({
        delivery_date: '',
        delivery_time: '',
        transport_model: '',
        cargo_type: '',
        packaging_type: '',
        status: '',
        distance: '',
        travel_time: '',
        delivery_address: '',
        pickup_address: '',
        services: [],
        notes: ''
    });

    // Загрузка опций для форм
    useEffect(() => {
        const loadOptions = async () => {
            console.log('Starting to load options...');
            setLoading(true);
            try {
                console.log('Calling api.getAllOptions()...');
                const data = await api.getAllOptions();
                console.log('Received options from server:', data);
                setOptions({
                    statuses: data.statuses || [],
                    cargoTypes: data.cargo_types || [],
                    transportModels: data.transport_models || [],
                    packagingTypes: data.packaging_types || [],
                    services: data.services || []
                });
                console.log('Set options state:', {
                    statuses: data.statuses || [],
                    cargoTypes: data.cargo_types || [],
                    transportModels: data.transport_models || [],
                    packagingTypes: data.packaging_types || [],
                    services: data.services || []
                });

                // Устанавливаем начальный статус "В ожидании"
                if (data.statuses && data.statuses.length > 0) {
                    const initialStatus = data.statuses.find(s => s.name === 'В ожидании');
                    if (initialStatus) {
                        setFormData(prev => ({
                            ...prev,
                            status: initialStatus.id
                        }));
                    }
                }
            } catch (error) {
                console.error('Error in loadOptions:', error);
                setError('Ошибка при загрузке опций');
            } finally {
                console.log('Finished loading options');
                setLoading(false);
            }
        };
        console.log('Calling loadOptions...');
        loadOptions();
    }, []);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleServiceChange = (serviceId) => {
        setFormData(prev => {
            const services = [...prev.services];
            const index = services.indexOf(serviceId);
            if (index === -1) {
                services.push(serviceId);
            } else {
                services.splice(index, 1);
            }
            return { ...prev, services };
        });
    };

    const validateForm = () => {
        if (!formData.delivery_date) return 'Выберите дату доставки';
        if (!formData.delivery_time) return 'Выберите время доставки';
        if (!formData.transport_model) return 'Выберите модель транспорта';
        if (!formData.cargo_type) return 'Выберите тип груза';
        if (!formData.packaging_type) return 'Выберите тип упаковки';
        if (!formData.status) return 'Выберите статус';
        if (!formData.distance || formData.distance <= 0) return 'Введите корректное расстояние';
        if (!formData.travel_time || formData.travel_time <= 0) return 'Введите корректное время в пути';
        if (!formData.delivery_address) return 'Введите адрес доставки';
        if (!formData.pickup_address) return 'Введите адрес отправления';
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const deliveryData = {
                ...formData,
                transport_model: parseInt(formData.transport_model),
                cargo_type: parseInt(formData.cargo_type),
                packaging_type: parseInt(formData.packaging_type),
                status: parseInt(formData.status),
                distance: parseFloat(formData.distance),
                travel_time: parseFloat(formData.travel_time)
            };

            await api.createDelivery(deliveryData);
            navigate('/deliveries');
        } catch (error) {
            setError('Ошибка при создании доставки');
            console.error('Error creating delivery:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Новая доставка
            </Typography>

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Дата доставки"
                                value={formData.delivery_date}
                                onChange={handleChange('delivery_date')}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Время доставки"
                                value={formData.delivery_time}
                                onChange={handleChange('delivery_time')}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Модель транспорта</InputLabel>
                                <Select
                                    value={formData.transport_model}
                                    onChange={handleChange('transport_model')}
                                    label="Модель транспорта"
                                >
                                    {options.transportModels.map(model => (
                                        <MenuItem key={model.id} value={model.id}>
                                            {model.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Тип груза</InputLabel>
                                <Select
                                    value={formData.cargo_type}
                                    onChange={handleChange('cargo_type')}
                                    label="Тип груза"
                                >
                                    {options.cargoTypes.map(type => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Тип упаковки</InputLabel>
                                <Select
                                    value={formData.packaging_type}
                                    onChange={handleChange('packaging_type')}
                                    label="Тип упаковки"
                                >
                                    {options.packagingTypes.map(type => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Статус</InputLabel>
                                <Select
                                    value={formData.status}
                                    onChange={handleChange('status')}
                                    label="Статус"
                                >
                                    {options.statuses.map(status => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Расстояние (км)"
                                value={formData.distance}
                                onChange={handleChange('distance')}
                                required
                                inputProps={{ min: 0, step: 0.1 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Время в пути (ч)"
                                value={formData.travel_time}
                                onChange={handleChange('travel_time')}
                                required
                                inputProps={{ min: 0, step: 0.1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Адрес доставки"
                                value={formData.delivery_address}
                                onChange={handleChange('delivery_address')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Адрес отправления"
                                value={formData.pickup_address}
                                onChange={handleChange('pickup_address')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Дополнительные услуги
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {options.services.map(service => (
                                    <Chip
                                        key={service.id}
                                        label={`${service.name} (${service.price} ₽)`}
                                        onClick={() => handleServiceChange(service.id)}
                                        color={formData.services.includes(service.id) ? "primary" : "default"}
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Примечания"
                                value={formData.notes}
                                onChange={handleChange('notes')}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Создать доставку'}
                            </Button>
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default NewDelivery; 