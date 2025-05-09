import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';

const DateTime = () => {
    const { applicationData, updateFormData } = useApplication();
    const [departureDateTime, setDepartureDateTime] = useState(applicationData.dateTimeData.departureDateTime || '');
    const [arrivalDateTime, setArrivalDateTime] = useState(applicationData.dateTimeData.arrivalDateTime || '');
    const [travelTime, setTravelTime] = useState(applicationData.dateTimeData.travelTime || '');

    useEffect(() => {
        updateFormData('dateTimeData', {
            departureDateTime,
            arrivalDateTime,
            travelTime
        });
    }, [departureDateTime, arrivalDateTime, travelTime]);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Box component="h4" sx={{ mb: 3, color: 'text.primary' }}>
                Дата и время
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Время отправления"
                    type="datetime-local"
                    value={departureDateTime}
                    onChange={(e) => setDepartureDateTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    label="Время прибытия"
                    type="datetime-local"
                    value={arrivalDateTime}
                    onChange={(e) => setArrivalDateTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    label="Время в пути"
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    fullWidth
                    placeholder="Введите время в пути"
                />
            </Box>
        </Box>
    );
};

export default DateTime; 