import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { useApplication } from '../../context/ApplicationContext';
import { useOptions } from '../../context/OptionsContext';

const CargoType = () => {
    const { applicationData, updateFormData } = useApplication();
    const { options, loading, error } = useOptions();

    const handleCargoTypeChange = (event) => {
        updateFormData('cargoData', {
            cargoType: event.target.value
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Тип груза
            </Typography>

            <Paper sx={{ p: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <FormControl fullWidth>
                    <InputLabel id="cargo-type-label">Тип груза</InputLabel>
                    <Select
                        labelId="cargo-type-label"
                        id="cargo-type"
                        value={applicationData.cargoData?.cargoType || ''}
                        onChange={handleCargoTypeChange}
                        label="Тип груза"
                    >
                        {options.cargo_types.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Container>
    );
};

export default CargoType; 