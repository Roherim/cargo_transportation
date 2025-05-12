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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    IconButton,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const DeliveryList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
        cargoTypes: [],
        transportModels: []
    });
    const [filters, setFilters] = useState({
        status: '',
        cargoType: '',
        transportModel: '',
        search: '',
        startDate: '',
        endDate: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'date',
        direction: 'asc'
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

    // Загрузка списка доставок
    useEffect(() => {
        const loadDeliveries = async () => {
            try {
                setLoading(true);
                const data = await api.getDeliveries(filters);
                setDeliveries(data);
            } catch (error) {
                if (error.message === 'Unauthorized') {
                    setError('Требуется авторизация');
                    navigate('/login');
                } else {
                    setError('Ошибка при загрузке списка доставок');
                    console.error('Error loading deliveries:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        loadDeliveries();
    }, [filters, navigate]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedDeliveries = [...deliveries].sort((a, b) => {
        if (sortConfig.key === 'date') {
            return sortConfig.direction === 'asc' 
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        }
        return sortConfig.direction === 'asc'
            ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
            : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const handleEdit = (id) => {
        navigate(`/delivery/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту доставку?')) {
            try {
                await api.deleteDelivery(id);
                // Обновляем список после удаления
                const updatedDeliveries = deliveries.filter(d => d.id !== id);
                setDeliveries(updatedDeliveries);
            } catch (error) {
                setError('Ошибка при удалении доставки');
                console.error('Error deleting delivery:', error);
            }
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
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Список доставок
            </Typography>

            {/* Фильтры */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Поиск"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Поиск по номеру или адресу"
                    />
                </Grid>
            </Grid>

            {/* Таблица */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Транспорт</TableCell>
                            <TableCell>Тип груза</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Адрес доставки</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedDeliveries.map((delivery) => (
                            <TableRow 
                                key={delivery.id}
                                hover
                                onClick={() => handleEdit(delivery.id)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{delivery.number}</TableCell>
                                <TableCell>{delivery.date}</TableCell>
                                <TableCell>{delivery.transport_model.name}</TableCell>
                                <TableCell>{delivery.cargo_type.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={delivery.status.name}
                                        color={
                                            delivery.status.name === 'В ожидании' ? 'warning' :
                                            delivery.status.name === 'В пути' ? 'info' :
                                            delivery.status.name === 'Доставлено' ? 'success' :
                                            'error'
                                        }
                                    />
                                </TableCell>
                                <TableCell>{delivery.delivery_address}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(delivery.id);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(delivery.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DeliveryList;