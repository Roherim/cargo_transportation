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
    Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

const DeliveryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
        cargoTypes: [],
        transportModels: []
    });

    const [formData, setFormData] = useState({
        delivery_date: '',
        delivery_time: '',
        transport_model: '',
        cargo_type: '',
        status: '',
        distance: '',
        time: '',
        delivery_address: '',
        pickup_address: '',
        notes: ''
    });

    // Загрузка опций для фильтров
    useEffect(() => {
        const loadFilterOptions = async () => {
            setLoading(true);
            try {
                const options = await api.getFilterOptions();
                setFilterOptions({
                    statuses: options.statuses || [],
                    cargoTypes: options.cargo_types || [],
                    transportModels: options.transport_models || []
                });

                // Устанавливаем начальный статус для новой доставки
                if (!isEdit && options.statuses && options.statuses.length > 0) {
                    const initialStatus = options.statuses.find(s => s.name === 'В ожидании');
                    if (initialStatus) {
                        setFormData(prev => ({
                            ...prev,
                            status: initialStatus.id
                        }));
                    }
                }
            } catch (error) {
                setError('Ошибка при загрузке опций фильтров');
                console.error('Error loading filter options:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFilterOptions();
    }, [isEdit]);

    // Загрузка данных доставки при редактировании
    useEffect(() => {
        const loadDelivery = async () => {
            if (isEdit) {
                setLoading(true);
                try {
                    const delivery = await api.getDelivery(id);
                    setFormData({
                        delivery_date: delivery.date,
                        delivery_time: delivery.time,
                        transport_model: delivery.transport_model.id,
                        cargo_type: delivery.cargo_type.id,
                        status: delivery.status.id,
                        distance: delivery.distance,
                        arrival_time: delivery.arrival_time,  // Исправлено
                        delivery_address: delivery.delivery_address,
                        pickup_address: delivery.pickup_address,
                        notes: delivery.notes || ''
                    });
                } catch (error) {
                    setError('Ошибка при загрузке данных доставки');
                    console.error('Error loading delivery:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadDelivery();
    }, [id, isEdit]);

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const validateForm = () => {
        if (!formData.delivery_date) return 'Выберите дату доставки';
        if (!formData.delivery_time) return 'Выберите время доставки';
        if (!formData.transport_model) return 'Выберите модель транспорта';
        if (!formData.cargo_type) return 'Выберите тип груза';
        if (!formData.status) return 'Выберите статус';
        if (!formData.distance || formData.distance <= 0) return 'Введите корректное расстояние';
        if (!formData.time || formData.time <= 0) return 'Введите корректное время в пути';
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
                status: parseInt(formData.status),
                distance: parseFloat(formData.distance),
                time: parseFloat(formData.time)
            };

            if (isEdit) {
                await api.updateDelivery(id, deliveryData);
            } else {
                await api.createDelivery(deliveryData);
            }
            navigate('/deliveries');
        } catch (error) {
            setError('Ошибка при сохранении доставки');
            console.error('Error saving delivery:', error);
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
                {isEdit ? 'Редактирование доставки' : 'Новая доставка'}
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
                                    {filterOptions.transportModels.map(model => (
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
                                    {filterOptions.cargoTypes.map(type => (
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
                                    {filterOptions.statuses.map(status => (
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
                                value={formData.time}
                                onChange={handleChange('time')}
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
                            <TextField
                                fullWidth
                                label="Примечания"
                                value={formData.notes}
                                onChange={handleChange('notes')}
                                multiline
                                rows={4}
                            />
                        </Grid>

                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box display="flex" gap={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Сохранить' : 'Создать')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/deliveries')}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default DeliveryForm; 