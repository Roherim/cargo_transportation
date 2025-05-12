import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, validateToken, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log('Auth state changed:', { isAuthenticated, loading });
        console.log('Current path:', location.pathname);
        
        if (!isAuthenticated && !loading) {
            console.log('Saving redirect path:', location.pathname);
            localStorage.setItem('redirectPath', location.pathname);
        }
    }, [isAuthenticated, loading, location.pathname]);

    useEffect(() => {
        const validateAuth = async () => {
            try {
                await validateToken();
            } catch (error) {
                console.error('Token validation error:', error);
                logout();
            }
        };

        if (localStorage.getItem('token')) {
            validateAuth();
        } else {
            logout();
        }
    }, [validateToken, logout]);

    console.log('Rendering ProtectedRoute:', { isAuthenticated, loading });
    
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;