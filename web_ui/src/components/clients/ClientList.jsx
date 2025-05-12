import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ClientList = () => {
    const [clients, setClients] = useState([
        {
            id: 1,
            name: 'ООО "ТрансЛогистик"',
            contactPerson: 'Иванов Иван',
            phone: '+7 (999) 123-45-67',
            email: 'ivanov@translog.ru',
            address: 'г. Москва, ул. Логистическая, 1',
            status: 'active',
            deliveryCount: 15
        },
        {
            id: 2,
            name: 'ИП Петров П.П.',
            contactPerson: 'Петров Петр',
            phone: '+7 (999) 765-43-21',
            email: 'petrov@example.com',
            address: 'г. Санкт-Петербург, пр. Невский, 100',
            status: 'active',
            deliveryCount: 8
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        status: 'active'
    });

    const handleOpenDialog = (client = null) => {
        if (client) {
            setSelectedClient(client);
            setFormData(client);
        } else {
            setSelectedClient(null);
            setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                status: 'active'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedClient(null);
    };

    const handleSaveClient = () => {
        if (selectedClient) {
            setClients(clients.map(client => 
                client.id === selectedClient.id ? { ...client, ...formData } : client
            ));
        } else {
            setClients([...clients, { 
                id: clients.length + 1, 
                ...formData,
                deliveryCount: 0
            }]);
        }
        handleCloseDialog();
    };

    const handleDeleteClient = (clientId) => {
        setClients(clients.filter(client => client.id !== clientId));
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Клиенты
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        backgroundColor: '#1a237e',
                        '&:hover': {
                            backgroundColor: '#283593',
                        },
                    }}
                >
                    Добавить клиента
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Контактное лицо</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Количество доставок</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.contactPerson}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.address}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={client.status === 'active' ? 'Активен' : 'Неактивен'}
                                        color={client.status === 'active' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>{client.deliveryCount}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(client)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClient(client.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedClient ? 'Редактировать клиента' : 'Добавить клиента'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Название организации"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Контактное лицо"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Телефон"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Адрес"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            multiline
                            rows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSaveClient} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientList; 