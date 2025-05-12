import React from 'react';
import { Container, Typography, Box, Grid, FormControl, TextField } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';

const AddressMap = () => {
    const { applicationData, updateFormData } = useApplication();

    const handleAddressChange = (type) => (event) => {
        updateFormData('addressData', {
            ...applicationData.addressData,
            [type]: event.target.value
        });
    };

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
                Выбор адресов
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Адрес отправления"
                                value={applicationData.addressData?.pickup_address || ''}
                                onChange={handleAddressChange('pickup_address')}
                                error={!applicationData.addressData?.pickup_address}
                                helperText={!applicationData.addressData?.pickup_address ? "Введите адрес отправления" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Адрес доставки"
                                value={applicationData.addressData?.delivery_address || ''}
                                onChange={handleAddressChange('delivery_address')}
                                error={!applicationData.addressData?.delivery_address}
                                helperText={!applicationData.addressData?.delivery_address ? "Введите адрес доставки" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Расстояние (км)"
                                type="number"
                                value={applicationData.addressData?.distance || ''}
                                onChange={handleAddressChange('distance')}
                                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                                error={!applicationData.addressData?.distance}
                                helperText={!applicationData.addressData?.distance ? "Введите расстояние" : ""}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AddressMap; 