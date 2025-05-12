import Model from './Model';
import Address from './Address';
import DateTime from './DateTime';
import Packaging from './Packaging';
import Services from './Services';
import CargoType from './CargoType';

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Новая доставка
            </Typography>

            <Paper sx={{ p: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Model />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Address />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <DateTime />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Packaging />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <CargoType />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Services />
                </Box>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#1a237e',
                        '&:hover': {
                            backgroundColor: '#283593',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать доставку'}
                </Button>
            </Paper>
        </Container>
    ); 