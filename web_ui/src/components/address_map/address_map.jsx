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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        updateFormData('addressData', {
            ...applicationData.addressData,
            file: file || null // Сохраняем файл или null, если файл не выбран
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
                               
                                helperText={!applicationData.addressData?.distance ? "Введите расстояние" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Загрузить файл (PDF)
                            </Typography>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{ marginTop: '8px' }}
                            />
                            {applicationData.addressData?.file && (
                                <Typography variant="body2" sx={{ mt: 1, color: 'green' }}>
                                    Файл выбран: {applicationData.addressData.file.name}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AddressMap;