import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

const DeliveryList = () => {
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        timeRange: [0, 24],
        distanceRange: [0, 1000],
    });

    // Временные данные для примера
    const deliveries = [
        {
            id: 1,
            number: 'DEL-001',
            distance: 150,
            time: 3,
            service: 'Погрузка',
            packaging: 'Картонная коробка',
            status: 'Проведено',
            technicalCondition: 'Исправно',
        },
        {
            id: 2,
            number: 'DEL-002',
            distance: 300,
            time: 5,
            service: 'Разгрузка',
            packaging: 'Паллета',
            status: 'В ожидании',
            technicalCondition: 'Исправно',
        },
        // Добавьте больше тестовых данных по необходимости
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Проведено':
                return '#2e7d32';
            case 'В ожидании':
                return '#ed6c02';
            default:
                return '#666666';
        }
    };

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

    const filteredDeliveries = deliveries.filter(delivery => {
        return (
            delivery.time >= filters.timeRange[0] &&
            delivery.time <= filters.timeRange[1] &&
            delivery.distance >= filters.distanceRange[0] &&
            delivery.distance <= filters.distanceRange[1]
        );
    });

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
                    <Grid container spacing={4}>
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
                {filteredDeliveries.map((delivery) => (
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
                                        label={delivery.status}
                                        sx={{
                                            backgroundColor: getStatusColor(delivery.status),
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
                                            Услуга
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.service}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Упаковка
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.packaging}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Техническое состояние
                                        </Typography>
                                        <Typography variant="body1">
                                            {delivery.technicalCondition}
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