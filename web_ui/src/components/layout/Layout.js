import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, CircularProgress } from '@mui/material';

const Layout = () => {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Layout auth check:', {
            isAuthenticated,
            loading,
            hasUser: !!user,
            hasToken: !!localStorage.getItem('token')
        });

        if (!loading && localStorage.getItem('token') && (!isAuthenticated || !user)) {
            console.log('Layout: Not authenticated, redirecting to login');
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, loading, user, navigate]);

    // Проверяем наличие токена при монтировании компонента
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && isAuthenticated) {
            console.log('Layout: Token missing, clearing auth');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if ((!isAuthenticated || !user) && localStorage.getItem('token')) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;