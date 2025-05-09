import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useApplication } from '../../context/ApplicationContext';

const AddressMap = () => {
    const { applicationData, updateFormData } = useApplication();
    const [fromAddress, setFromAddress] = useState(applicationData.addressData.fromAddress || '');
    const [toAddress, setToAddress] = useState(applicationData.addressData.toAddress || '');
    const [distance, setDistance] = useState(applicationData.addressData.distance || 0);

    // Обновляем данные в контексте при изменении полей формы
    useEffect(() => {
        updateFormData('addressData', {
            fromAddress,
            toAddress,
            distance
        });
    }, [fromAddress, toAddress, distance]);

    const handleSwapAddresses = () => {
        setFromAddress(toAddress);
        setToAddress(fromAddress);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
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
                    Адреса и расстояние
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '600px', mx: 'auto' }}>
                            <TextField
                                fullWidth
                                label="Откуда"
                                value={fromAddress}
                                onChange={(e) => setFromAddress(e.target.value)}
                                placeholder="Введите адрес отправления"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Tooltip title="Поменять местами">
                                    <IconButton onClick={handleSwapAddresses}>
                                        <SwapHorizIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <TextField
                                fullWidth
                                label="Куда"
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                                placeholder="Введите адрес назначения"
                            />
                            <TextField
                                fullWidth
                                label="Дистанция (км)"
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AddressMap; 