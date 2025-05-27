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

const Packaging = () => {
    const { applicationData, updateFormData } = useApplication();
    const [packaging, setPackaging] = useState('');
    const [packagingTypes, setPackagingTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackagingTypes = async () => {
            try {
                const data = await api.getOptions();
                if (data?.packaging_types) {
                    setPackagingTypes(data.packaging_types);
                    if (applicationData.packagingData?.packaging) {
                        setPackaging(applicationData.packagingData.packaging);
                    }
                }
            } catch (error) {
                console.error('Error fetching packaging types:', error);
                setError('Ошибка при загрузке типов упаковки');
            } finally {
                setLoading(false);
            }
        };
        fetchPackagingTypes();
    }, []);

    const handlePackagingChange = (e) => {
        const newValue = e.target.value;
        setPackaging(newValue);
        updateFormData('packagingData', {
            packaging: newValue
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

    if (!packagingTypes.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="warning">Нет доступных типов упаковки</Alert>
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
                Выбор типа упаковки
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <FormControl fullWidth>
                    <FormLabel>Тип упаковки</FormLabel>
                    <TextField
                        select
                        value={packaging}
                        onChange={handlePackagingChange}
                        fullWidth
                    
                        helperText={!packaging ? "Выберите тип упаковки" : ""}
                    >
                        {packagingTypes.map((type) => (
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

export default Packaging; 