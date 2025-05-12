import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Badge,
    Box,
    Divider,
    Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Доставка выполнена',
            message: 'Доставка #123 успешно завершена',
            time: '10 минут назад',
            read: false,
        },
        {
            id: 2,
            type: 'warning',
            title: 'Задержка доставки',
            message: 'Доставка #124 задерживается на 30 минут',
            time: '1 час назад',
            read: false,
        },
        {
            id: 3,
            type: 'info',
            title: 'Новая доставка',
            message: 'Создана новая доставка #125',
            time: '2 часа назад',
            read: true,
        },
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'info':
                return <InfoIcon color="info" />;
            default:
                return <InfoIcon />;
        }
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notification => ({
            ...notification,
            read: true,
        })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Уведомления
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                    <Button
                        variant="outlined"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Отметить все как прочитанные
                    </Button>
                </Box>
            </Box>

            <Paper>
                <List>
                    {notifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <ListItem
                                sx={{
                                    backgroundColor: notification.read ? 'transparent' : '#f5f5f5',
                                }}
                            >
                                <ListItemIcon>
                                    {getIcon(notification.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                                            {notification.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {notification.time}
                                            </Typography>
                                        </>
                                    }
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(notification.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                            {index < notifications.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Notifications; 