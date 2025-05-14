import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    FormControl,
    FormLabel,
    Chip,
    CircularProgress,
    Alert,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import WarningIcon from '@mui/icons-material/Warning';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useApplication } from '../../context/ApplicationContext';
import { api } from '../../services/api';

const Services = () => {
    const { applicationData, updateFormData } = useApplication();
    const [selectedServices, setSelectedServices] = useState(applicationData.servicesData?.services||[]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getOptions();
                if (data?.services) {
                    setServices(data.services);
                    if (applicationData.servicesData?.services) {
                        setSelectedServices(applicationData.servicesData.services);
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Ошибка при загрузке услуг');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceChange = (serviceId) => (event) => {
        const newSelectedServices = event.target.checked
            ? [...selectedServices, serviceId]
            : selectedServices.filter(id => id !== serviceId);

        setSelectedServices(newSelectedServices);
        updateFormData('servicesData', {
            services: newSelectedServices
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

    if (!services.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="warning">Нет доступных услуг</Alert>
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
                Выбор дополнительных услуг
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Дополнительные услуги</FormLabel>
                    <FormGroup>
                        {services.map((service) => (
                            <FormControlLabel
                                key={service.id}
                                control={
                                    <Checkbox
                                        checked={selectedServices.includes(service.id)}
                                        onChange={handleServiceChange(service.id)}
                                    />
                                }
                                label={service.name}
                            />
                        ))}
                    </FormGroup>
                    {!selectedServices.length && (
                        <FormHelperText error>
                            Выберите хотя бы одну услугу
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>
        </Container>
    );
};

const getServiceIcon = (serviceName) => {
    const iconProps = { sx: { fontSize: 40 } };
    
    switch (serviceName.toLowerCase()) {
        case 'доставка до двери':
            return <LocalShippingIcon {...iconProps} />;
        case 'складское хранение':
            return <WarehouseIcon {...iconProps} />;
        case 'для физических лиц':
            return <PersonIcon {...iconProps} />;
        case 'для юридических лиц':
            return <BusinessIcon {...iconProps} />;
        case 'медицинские товары':
            return <LocalPharmacyIcon {...iconProps} />;
        case 'хрупкий груз':
            return <WarningIcon {...iconProps} />;
        case 'температурный режим':
            return <ThermostatIcon {...iconProps} />;
        default:
            return <LocalShippingIcon {...iconProps} />;
    }
};

export default Services; 