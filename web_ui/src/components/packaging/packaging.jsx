import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    MenuItem,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorageIcon from '@mui/icons-material/Storage';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BlockIcon from '@mui/icons-material/Block';
import { useApplication } from '../../context/ApplicationContext';

const PACKAGING_TYPES = [
    'Коробка',
    'Палета',
    'Контейнер',
    'Без упаковки'
];

const Packaging = () => {
    const { applicationData, updateFormData } = useApplication();
    const [packaging, setPackaging] = useState(applicationData.packagingData.packaging || '');

    useEffect(() => {
        updateFormData('packagingData', {
            packaging
        });
    }, [packaging]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, md: 4 },
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 4, 
                        fontWeight: 600,
                        color: '#1a237e',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textAlign: 'center',
                    }}
                >
                    Выбор упаковки
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel>Тип упаковки</FormLabel>
                    <TextField
                        select
                        value={packaging}
                        onChange={(e) => setPackaging(e.target.value)}
                        fullWidth
                    >
                        {PACKAGING_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>

                <Box 
                    sx={{ 
                        mt: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LocalShippingIcon />}
                        sx={{
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#283593',
                            },
                            px: 4,
                            py: 1.5,
                            minWidth: 200,
                        }}
                    >
                        Применить
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Packaging; 