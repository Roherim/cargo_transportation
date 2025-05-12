import React from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const Analytics = () => {
    // Пример данных для графиков
    const deliveryData = [
        { name: 'Янв', deliveries: 65, distance: 1200 },
        { name: 'Фев', deliveries: 59, distance: 1100 },
        { name: 'Мар', deliveries: 80, distance: 1500 },
        { name: 'Апр', deliveries: 81, distance: 1600 },
        { name: 'Май', deliveries: 56, distance: 1000 },
    ];

    const statusData = [
        { name: 'Выполнено', value: 400 },
        { name: 'В пути', value: 300 },
        { name: 'Ожидает', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Аналитика доставок
            </Typography>

            <Grid container spacing={3}>
                {/* График доставок по месяцам */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Статистика доставок по месяцам
                        </Typography>
                        <BarChart
                            width={700}
                            height={300}
                            data={deliveryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="deliveries" fill="#8884d8" name="Количество доставок" />
                            <Bar dataKey="distance" fill="#82ca9d" name="Общая дистанция (км)" />
                        </BarChart>
                    </Paper>
                </Grid>

                {/* График статусов доставок */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Статусы доставок
                        </Typography>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={statusData}
                                cx={150}
                                cy={150}
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </Paper>
                </Grid>

                {/* График тренда дистанций */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Тренд дистанций доставок
                        </Typography>
                        <LineChart
                            width={1000}
                            height={300}
                            data={deliveryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="distance" stroke="#8884d8" name="Дистанция (км)" />
                        </LineChart>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analytics; 