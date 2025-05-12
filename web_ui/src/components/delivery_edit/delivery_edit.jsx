import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';
import DeliveryForm from '../delivery_form/delivery_form';
import { api } from '../../services/api';

const DeliveryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applicationData, updateFormData, handleUpdate, loading, error } = useApplication();

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const delivery = await api.getDelivery(id);
                
                // Обновляем данные формы
                updateFormData('modelData', {
                    model: delivery.transport_model,
                    number: delivery.transport_number
                });
                
                updateFormData('addressData', {
                    pickup_address: delivery.pickup_address,
                    delivery_address: delivery.delivery_address,
                    distance: delivery.distance
                });
                
                updateFormData('datetimeData', {
                    departure_date: delivery.departure_date,
                    departure_time: delivery.departure_time,
                    arrival_date: delivery.arrival_date,
                    arrival_time: delivery.arrival_time,
                    travel_time: delivery.travel_time
                });
                
                updateFormData('packagingData', {
                    packaging: delivery.packaging_type
                });

                updateFormData('cargoData', {
                    cargo_type: delivery.cargo_type
                });
                
                updateFormData('servicesData', {
                    services: delivery.services
                });
            } catch (error) {
                console.error('Error fetching delivery:', error);
            }
        };

        fetchDelivery();
    }, [id, updateFormData]);

    const handleSubmit = async () => {
        const success = await handleUpdate(id);
        if (success) {
            navigate('/deliveries');
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
                Редактирование доставки
            </Typography>

            <DeliveryForm />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Сохранить изменения
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => navigate('/deliveries')}
                >
                    Отмена
                </Button>
            </Box>
        </Container>
    );
};

export default DeliveryEdit; 