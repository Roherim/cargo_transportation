import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { api } from '../../services/api';

const DeliveryReport = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
        cargoTypes: [],
        transportModels: []
    });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        cargoType: '',
        transportModel: ''
    });

    // Загрузка опций для фильтров
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const options = await api.getAllOptions();
                setFilterOptions({
                    statuses: options.statuses,
                    cargoTypes: options.cargo_types,
                    transportModels: options.transport_models
                });
            } catch (error) {
                setError('Ошибка при загрузке опций фильтров');
                console.error('Error loading filter options:', error);
            }
        };
        loadFilterOptions();
    }, []);

    // Загрузка отчета
    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                const data = await api.getDeliveryReport(filters);
                setDeliveries(data.deliveries);
                setStatistics(data.statistics);
            } catch (error) {
                setError('Ошибка при загрузке отчета');
                console.error('Error loading report:', error);
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Отчет по доставкам
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Статус</InputLabel>
                            <Select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <MenuItem value="">Все</MenuItem>
                                {filterOptions.statuses.map(status => (
                                    <MenuItem key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Тип груза</InputLabel>
                            <Select
                                value={filters.cargoType}
                                onChange={(e) => handleFilterChange('cargoType', e.target.value)}
                            >
                                <MenuItem value="">Все</MenuItem>
                                {filterOptions.cargoTypes.map(type => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Модель транспорта</InputLabel>
                            <Select
                                value={filters.transportModel}
                                onChange={(e) => handleFilterChange('transportModel', e.target.value)}
                            >
                                <MenuItem value="">Все</MenuItem>
                                {filterOptions.transportModels.map(model => (
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Дата начала"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Дата окончания"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Статистика по статусам
                </Typography>
                <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statistics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#1a237e" name="Количество доставок" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Список доставок
                </Typography>
                <Grid container spacing={3}>
                    {deliveries.map((delivery) => (
                        <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {delivery.number}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Дата: {delivery.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Модель: {delivery.transport_model.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Тип груза: {delivery.cargo_type.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Статус: {delivery.status.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Адрес: {delivery.delivery_address}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default DeliveryReport; 