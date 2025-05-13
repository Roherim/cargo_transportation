import React from 'react';
import { Container, Typography, Box, Grid, FormControl, TextField } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';

const DateTime = () => {
    const { applicationData, updateFormData } = useApplication();

    const handleDateTimeChange = (type) => (event) => {
        updateFormData('datetimeData', {
            ...applicationData.datetimeData,
            [type]: event.target.value
        });
    };
console.log(applicationData.datetimeData)
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
                Выбор даты и времени
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Дата отправления"
                                type="date"
                                value={applicationData.datetimeData?.departure_date || ''}
                                onChange={handleDateTimeChange('departure_date')}
                                InputLabelProps={{ shrink: true }}
                                error={!applicationData.datetimeData?.departure_date}
                                helperText={!applicationData.datetimeData?.departure_date ? "Выберите дату отправления" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Время отправления"
                                type="time"
                                value={applicationData.datetimeData?.departure_time || ''}
                                onChange={handleDateTimeChange('departure_time')}
                                InputLabelProps={{ shrink: true }}
                                error={!applicationData.datetimeData?.departure_time}
                                helperText={!applicationData.datetimeData?.departure_time ? "Выберите время отправления" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Дата прибытия"
                                type="date"
                                value={applicationData.datetimeData?.arrival_date || ''}
                                onChange={handleDateTimeChange('arrival_date')}
                                InputLabelProps={{ shrink: true }}
                                error={!applicationData.datetimeData?.arrival_date}
                                helperText={!applicationData.datetimeData?.arrival_date ? "Выберите дату прибытия" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Время прибытия"
                                type="time"
                                value={applicationData.datetimeData?.arrival_time || ''}
                                onChange={handleDateTimeChange('arrival_time')}
                                InputLabelProps={{ shrink: true }}
                                error={!applicationData.datetimeData?.arrival_time}
                                helperText={!applicationData.datetimeData?.arrival_time ? "Выберите время прибытия" : ""}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Время в пути (часы)"
                                type="number"
                                value={applicationData.datetimeData?.travel_time || ''}
                                onChange={handleDateTimeChange('travel_time')}
                                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                                error={!applicationData.datetimeData?.travel_time}
                                helperText={!applicationData.datetimeData?.travel_time ? "Введите время в пути" : ""}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default DateTime; 