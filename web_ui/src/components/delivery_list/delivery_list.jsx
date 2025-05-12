import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    TextField,
    IconButton,
    Tooltip,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { api } from '../../services/api';

const DeliveryList = () => {
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
        cargoTypes: [],
        transportModels: []
    });
    const [filters, setFilters] = useState({
        timeRange: [0, 24],
        distanceRange: [0, 1000],
        status: '',
        cargoType: '',
        transportModel: '',
        search: ''
    });

    // Загрузка опций для фильтров
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [statuses, cargoTypes, transportModels] = await Promise.all([
                    api.getDeliveryStatuses(),
                    api.getCargoTypes(),
                    api.getTransportModels()
                ]);

                setFilterOptions({
                    statuses,
                    cargoTypes,
                    transportModels
                });
            } catch (error) {
                console.error('Error fetching filter options:', error);
                setError(error.message);
            }
        };

        fetchFilterOptions();
    }, []);

    // Загрузка доставок с фильтрами
    useEffect(() => {
        console.log('Инициирован запрос на получение доставок');
        console.log('Текущие фильтры:', JSON.stringify(filters));
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                console.log('Начало загрузки данных');
                const queryParams = {};
                
                if (filters.status) {
                    queryParams.status = filters.status;
                }
                if (filters.cargoType) {
                    queryParams.cargo_type = filters.cargoType;
                }
                if (filters.transportModel) {
                    queryParams.transport_model = filters.transportModel;
                }
                if (filters.search) {
                    queryParams.search = filters.search;
                }
                if (filters.timeRange[0] > 0 || filters.timeRange[1] < 24) {
                    queryParams.min_time = filters.timeRange[0];
                    queryParams.max_time = filters.timeRange[1];
                }
                if (filters.distanceRange[0] > 0 || filters.distanceRange[1] < 1000) {
                    queryParams.min_distance = filters.distanceRange[0];
                    queryParams.max_distance = filters.distanceRange[1];
                }

                console.log('Параметры запроса:', JSON.stringify(queryParams));
                try {
                    const data = await api.getDeliveries(queryParams);
                    console.log('Успешно получены данные:', data);
                    console.log('Количество полученных доставок:', data.length);
                    setDeliveries(data);
                } catch (error) {
                    console.error('Ошибка выполнения запроса:', error);
                    setError(error.response?.data?.message || error.message);
                    setDeliveries([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке доставок:', error);
                setError(error.message);
            } finally {
                console.log('Завершение загрузки данных');
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, [filters]);

    const handleTimeChange = (event, newValue) => {
        setFilters(prev => ({
            ...prev,
            timeRange: newValue,
        }));
    };

    const handleDistanceChange = (event, newValue) => {
        setFilters(prev => ({
            ...prev,
            distanceRange: newValue,
        }));
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusColor = (statusName) => {
        switch (statusName) {
            case 'Проведено':
                return '#2e7d32'; // зеленый
            case 'В ожидании':
                return '#ffd600'; // желтый
            default:
                return '#666666';
        }
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
                <Alert severity="error" sx={{ maxWidth: 600 }}>
                    Ошибка загрузки: {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600,
                        color: '#1a237e',
                    }}
                >
                    Доставка
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Фильтры">
                        <IconButton 
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{ 
                                backgroundColor: showFilters ? '#e3f2fd' : 'transparent',
                                '&:hover': { backgroundColor: '#e3f2fd' }
                            }}
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/new_delivery')}
                        sx={{
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#283593',
                            },
                        }}
                    >
                        Новая доставка
                    </Button>
                </Box>
            </Box>

            {/* Фильтры */}
            {showFilters && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4,
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Поиск"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Статус</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    label="Статус"
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    {filterOptions.statuses.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Тип груза</InputLabel>
                                <Select
                                    value={filters.cargoType}
                                    onChange={(e) => handleFilterChange('cargoType', e.target.value)}
                                    label="Тип груза"
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    {filterOptions.cargoTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Модель транспорта</InputLabel>
                                <Select
                                    value={filters.transportModel}
                                    onChange={(e) => handleFilterChange('transportModel', e.target.value)}
                                    label="Модель транспорта"
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    {filterOptions.transportModels.map((model) => (
                                        <MenuItem key={model.id} value={model.id}>
                                            {model.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography gutterBottom>Время в пути (часы)</Typography>
                            <Slider
                                value={filters.timeRange}
                                onChange={handleTimeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={24}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 12, label: '12' },
                                    { value: 24, label: '24' },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography gutterBottom>Дистанция (км)</Typography>
                            <Slider
                                value={filters.distanceRange}
                                onChange={handleDistanceChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1000}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 500, label: '500' },
                                    { value: 1000, label: '1000' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Список доставок */}
            <Grid container spacing={3}>
                {deliveries.map((delivery) => (
                    <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                },
                            }}
                            onClick={() => navigate(`/delivery/${delivery.id}`)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {delivery.number}
                                    </Typography>
                                    <Chip
                                        label={delivery.status.name}
                                        sx={{
                                            backgroundColor: getStatusColor(delivery.status.name),
                                            color: 'white',
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Дистанция
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.distance} км
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Время в пути
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.time} ч
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Тип груза
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.cargo_type.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Транспорт
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.transport_model.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Адрес доставки
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.delivery_address}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DeliveryList;