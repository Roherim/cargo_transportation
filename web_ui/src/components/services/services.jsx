import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Chip,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import WarningIcon from '@mui/icons-material/Warning';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const serviceTypes = [
    {
        id: 'to-customer',
        name: 'До клиента',
        icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
        description: 'Доставка до двери клиента',
    },
    {
        id: 'warehouse-transfer',
        name: 'Перемещение между складами',
        icon: <WarehouseIcon sx={{ fontSize: 40 }} />,
        description: 'Транспортировка между складскими помещениями',
    },
    {
        id: 'individual',
        name: 'Физ. лицо',
        icon: <PersonIcon sx={{ fontSize: 40 }} />,
        description: 'Доставка для физических лиц',
    },
    {
        id: 'legal',
        name: 'Юр. лицо',
        icon: <BusinessIcon sx={{ fontSize: 40 }} />,
        description: 'Доставка для юридических лиц',
    },
    {
        id: 'medical',
        name: 'Мед. товары',
        icon: <LocalPharmacyIcon sx={{ fontSize: 40 }} />,
        description: 'Транспортировка медицинских товаров',
    },
    {
        id: 'fragile',
        name: 'Хрупкий груз',
        icon: <WarningIcon sx={{ fontSize: 40 }} />,
        description: 'Особая осторожность при транспортировке',
    },
    {
        id: 'temperature',
        name: 'Температурный режим',
        icon: <ThermostatIcon sx={{ fontSize: 40 }} />,
        description: 'Соблюдение температурного режима',
    },
];

const Services = ({ onSubmit, initialValue = [] }) => {
    const [selectedServices, setSelectedServices] = useState(initialValue);

    const handleServiceToggle = (serviceId) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(selectedServices);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, md: 4 },
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
            >
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
                    Выбор услуг
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel 
                        component="legend" 
                        sx={{ 
                            mb: 3, 
                            color: '#1a237e', 
                            fontWeight: 500,
                            fontSize: '1.1rem',
                        }}
                    >
                        Выберите необходимые услуги
                    </FormLabel>

                    {/* Выбранные услуги */}
                    {selectedServices.length > 0 && (
                        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedServices.map(serviceId => {
                                const service = serviceTypes.find(s => s.id === serviceId);
                                return (
                                    <Chip
                                        key={serviceId}
                                        label={service.name}
                                        onDelete={() => handleServiceToggle(serviceId)}
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1a237e',
                                            '& .MuiChip-deleteIcon': {
                                                color: '#1a237e',
                                                '&:hover': {
                                                    color: '#283593',
                                                },
                                            },
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}

                    <Grid container spacing={3}>
                        {serviceTypes.map((service) => (
                            <Grid item xs={12} sm={6} md={4} key={service.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        border: selectedServices.includes(service.id) 
                                            ? '2px solid #1a237e' 
                                            : '1px solid #e0e0e0',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                        },
                                    }}
                                >
                                    <CardActionArea 
                                        onClick={() => handleServiceToggle(service.id)}
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'flex-start',
                                                    mb: 1.5,
                                                }}
                                            >
                                                <Checkbox 
                                                    checked={selectedServices.includes(service.id)}
                                                    sx={{ 
                                                        mr: 1,
                                                        mt: 0.5,
                                                    }}
                                                />
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    color: '#1a237e',
                                                    flex: 1,
                                                }}>
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 40,
                                                        height: 40,
                                                        mr: 1.5,
                                                    }}>
                                                        {service.icon}
                                                    </Box>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '1.1rem',
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        {service.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    pl: 6,
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {service.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </FormControl>

                <Box 
                    sx={{ 
                        mt: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={selectedServices.length === 0}
                        startIcon={<LocalShippingIcon />}
                        sx={{
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#283593',
                            },
                            px: 4,
                            py: 1.5,
                            minWidth: 200,
                        }}
                    >
                        Применить
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Services; 