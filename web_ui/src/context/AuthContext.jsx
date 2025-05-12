import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_CONFIG } from '../config/api.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Fetch user data
            fetch(API_CONFIG.ENDPOINTS.AUTH.USER_INFO, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                        return;
                    }
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data);
                })
                .catch((error) => {
                    console.error('Auth error:', error);
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { token, user } = data;
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            const { token, user } = data;
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};