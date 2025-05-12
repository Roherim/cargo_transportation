import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    Chip,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const ClientDetails = ({ client }) => {
    if (!client) return null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {client.name}
                    </Typography>
                    <Chip 
                        label={client.status === 'active' ? 'Активен' : 'Неактивен'}
                        color={client.status === 'active' ? 'success' : 'default'}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Контактная информация
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="action" />
                                        <Typography>
                                            <strong>Контактное лицо:</strong> {client.contactPerson}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon color="action" />
                                        <Typography>
                                            <strong>Телефон:</strong> {client.phone}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EmailIcon color="action" />
                                        <Typography>
                                            <strong>Email:</strong> {client.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon color="action" />
                                        <Typography>
                                            <strong>Адрес:</strong> {client.address}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Статистика
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Количество доставок
                                        </Typography>
                                        <Typography variant="h4">
                                            {client.deliveryCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ClientDetails; 