import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { api } from '../../services/api';

const ExportData = () => {
    const [exportType, setExportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState('excel');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.exportData({
                type: exportType,
                startDate,
                endDate,
                format
            });

            // Создаем ссылку для скачивания файла
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `export_${exportType}_${new Date().toISOString()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setSuccess('Данные успешно экспортированы');
        } catch (error) {
            setError('Ошибка при экспорте данных');
            console.error('Error exporting data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Экспорт данных
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Тип данных</InputLabel>
                            <Select
                                value={exportType}
                                onChange={(e) => setExportType(e.target.value)}
                            >
                                <MenuItem value="deliveries">Доставки</MenuItem>
                                <MenuItem value="users">Пользователи</MenuItem>
                                <MenuItem value="analytics">Аналитика</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Дата начала"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Дата окончания"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Формат экспорта</InputLabel>
                            <Select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                            >
                                <MenuItem value="excel">Excel</MenuItem>
                                <MenuItem value="csv">CSV</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExport}
                            disabled={loading || !exportType || !startDate || !endDate}
                            sx={{
                                backgroundColor: '#1a237e',
                                '&:hover': {
                                    backgroundColor: '#283593',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Экспортировать'}
                        </Button>
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    {success && (
                        <Grid item xs={12}>
                            <Alert severity="success">{success}</Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default ExportData; 