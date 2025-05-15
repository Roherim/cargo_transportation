import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { api } from '../../services/api';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetForm } = useApplication();
    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Система доставки
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{
                            backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Список доставок
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => {navigate('/new_delivery'); resetForm()}}
                        sx={{
                            backgroundColor: isActive('/new_delivery') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Новая доставка
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/report')}
                        sx={{
                            backgroundColor: isActive('/report') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Отчёты
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => {api.logout(); navigate('/login')}}
                        sx={{
                            backgroundColor: isActive('/report') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                    >
                        Выход
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation; 