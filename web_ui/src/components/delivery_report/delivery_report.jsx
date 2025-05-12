import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format as formatDate } from 'date-fns';

const DeliveryReport = () => {
    // Состояния для фильтров
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [deliveryType, setDeliveryType] = useState('');
    const [cargoType, setCargoType] = useState('');

    // Состояния для данных
    const [deliveries, setDeliveries] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [orderBy, setOrderBy] = useState('date');
    const [order, setOrder] = useState('asc');

    // Типы доставок и грузов (заглушка, в реальном приложении будут из API)
    const deliveryTypes = ['Стандартная', 'Экспресс', 'Междугородняя'];
    const cargoTypes = ['Обычный', 'Хрупкий', 'Крупногабаритный'];

    // Обработчик сортировки
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Фильтрация и сортировка данных
    const filteredDeliveries = deliveries
        .filter(delivery => {
            const deliveryDate = new Date(delivery.date);
            const isInDateRange = (!startDate || deliveryDate >= startDate) &&
                                (!endDate || deliveryDate <= endDate);
            const matchesType = !deliveryType || delivery.type === deliveryType;
            const matchesCargo = !cargoType || delivery.cargoType === cargoType;
            return isInDateRange && matchesType && matchesCargo;
        })
        .sort((a, b) => {
            const isAsc = order === 'asc';
            if (orderBy === 'date') {
                return isAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            }
            return isAsc ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
        });

    // Подготовка данных для графика
    useEffect(() => {
        // Группировка данных по дате
        const groupedData = filteredDeliveries.reduce((acc, delivery) => {
            const date = formatDate(new Date(delivery.date), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Преобразование в формат для графика
        const chartData = Object.entries(groupedData).map(([date, count]) => ({
            date,
            count
        }));

        setChartData(chartData);
    }, [filteredDeliveries]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Отчёт по доставкам
            </Typography>

            {/* Фильтры */}
            <Card sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Дата начала"
                            value={startDate}
                            onChange={setStartDate}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Дата окончания"
                            value={endDate}
                            onChange={setEndDate}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Тип доставки"
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Все</MenuItem>
                            {deliveryTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            label="Тип груза"
                            value={cargoType}
                            onChange={(e) => setCargoType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Все</MenuItem>
                            {cargoTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Card>

            {/* График */}
            <Card sx={{ p: 2, mb: 4, height: 400 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Количество доставок
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#1976d2" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Таблица */}
            <Card sx={{ p: 2 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'date'}
                                        direction={orderBy === 'date' ? order : 'asc'}
                                        onClick={() => handleRequestSort('date')}
                                    >
                                        Дата
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Модель</TableCell>
                                <TableCell>Тип доставки</TableCell>
                                <TableCell>Тип груза</TableCell>
                                <TableCell>Дистанция</TableCell>
                                <TableCell>Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeliveries.map((delivery) => (
                                <TableRow key={delivery.id}>
                                    <TableCell>{formatDate(new Date(delivery.date), 'dd.MM.yyyy')}</TableCell>
                                    <TableCell>{delivery.model}</TableCell>
                                    <TableCell>{delivery.type}</TableCell>
                                    <TableCell>{delivery.cargoType}</TableCell>
                                    <TableCell>{delivery.distance} км</TableCell>
                                    <TableCell>{delivery.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default DeliveryReport; 