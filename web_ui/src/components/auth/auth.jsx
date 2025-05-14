
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Container, Paper, Typography, TextField, Button, Grid, Link } from '@mui/material';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_CONFIG } from '../../config/api.config';

const Auth = ({link, setLink}) => {
    const[logged, setLogged]=useState(localStorage.getItem('logged'))
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
      const [token, setToken] = useState(localStorage.getItem('token'));
      const [loading, setLoading] = useState(true);

    const login = async (username, password) => {
        try {
          console.log('Attempting login with:', { username, password });
          
          const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            throw new Error(errorData.error || 'Login failed');
          }
    
          const data = await response.json();
          console.log('Login successful:', data);
          localStorage.setItem('logged', 'true');
          const { token, user } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('link','/')
          localStorage.setItem('/', JSON.stringify(user));
          setToken(token);
          setUser(user);
          navigate('/');
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: error.message };
        }
      };
    const navigate = useNavigate();
    const location = useLocation();

  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            console.log('Attempting login with:', { username: formData.username });
            const result = await login(formData.username, formData.password);
            
            if (!result.success) {
                setError(result.error || 'Ошибка авторизации');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Ошибка при попытке входа');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    let flag = link === "/login";

    if (logged === "true" && flag === false) {
      return  <Navigate to={link}/>;
    } else 
    return (
        
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center">
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Имя пользователя"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {!isLogin && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Подтвердите пароль"
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        )}
                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin
                                        ? 'Нет аккаунта? Зарегистрируйтесь'
                                        : 'Уже есть аккаунт? Войдите'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Auth;


