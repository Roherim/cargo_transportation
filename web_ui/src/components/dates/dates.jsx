import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';

const Dates = () => {
    const { applicationData, updateFormData } = useApplication();
    const { datesData } = applicationData;

    const handleDateChange = (field) => (event) => {
        const value = event.target.value;
        updateFormData('datesData', {
            ...datesData,
            [field]: value
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Даты и время доставки
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Дата отправления"
                        type="date"
                        value={datesData?.departureDate || ''}
                        onChange={handleDateChange('departureDate')}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!datesData?.departureDate}
                        helperText={!datesData?.departureDate ? 'Выберите дату отправления' : ''}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Время отправления"
                        type="time"
                        value={datesData?.departureTime || ''}
                        onChange={handleDateChange('departureTime')}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!datesData?.departureTime}
                        helperText={!datesData?.departureTime ? 'Выберите время отправления' : ''}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Дата прибытия"
                        type="date"
                        value={datesData?.arrivalDate || ''}
                        onChange={handleDateChange('arrivalDate')}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!datesData?.arrivalDate}
                        helperText={!datesData?.arrivalDate ? 'Выберите дату прибытия' : ''}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Время прибытия"
                        type="time"
                        value={datesData?.arrivalTime || ''}
                        onChange={handleDateChange('arrivalTime')}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!datesData?.arrivalTime}
                        helperText={!datesData?.arrivalTime ? 'Выберите время прибытия' : ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Время в пути (часы)"
                        type="number"
                        value={datesData?.travelTime || ''}
                        onChange={handleDateChange('travelTime')}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!datesData?.travelTime}
                        helperText={!datesData?.travelTime ? 'Укажите время в пути' : ''}
                        inputProps={{ min: 0, step: 0.5 }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dates; 