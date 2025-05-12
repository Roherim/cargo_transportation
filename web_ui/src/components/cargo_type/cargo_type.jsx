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
    CircularProgress,
    Alert
} from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';
import { api } from '../../services/api';

const CargoType = () => {
    const { applicationData, updateFormData } = useApplication();
    const [cargoType, setCargoType] = useState('');
    const [cargoTypes, setCargoTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCargoTypes = async () => {
            try {
                const data = await api.getOptions();
                if (data?.cargo_types) {
                    setCargoTypes(data.cargo_types);
                    if (applicationData.cargoData?.cargo_type) {
                        setCargoType(applicationData.cargoData.cargo_type);
                    }
                }
            } catch (error) {
                console.error('Error fetching cargo types:', error);
                setError('Ошибка при загрузке типов груза');
            } finally {
                setLoading(false);
            }
        };
        fetchCargoTypes();
    }, []);

    const handleCargoTypeChange = (e) => {
        const newValue = e.target.value;
        setCargoType(newValue);
        updateFormData('cargoData', {
            cargo_type: newValue
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

    if (!cargoTypes.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="warning">Нет доступных типов груза</Alert>
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
                Выбор типа груза
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <FormControl fullWidth>
                    <FormLabel>Тип груза</FormLabel>
                    <TextField
                        select
                        value={cargoType}
                        onChange={handleCargoTypeChange}
                        fullWidth
                        error={!cargoType}
                        helperText={!cargoType ? "Выберите тип груза" : ""}
                    >
                        {cargoTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
            </Box>
        </Container>
    );
};

export default CargoType; 