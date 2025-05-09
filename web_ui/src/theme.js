import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
        },
        secondary: {
            main: '#ce93d8',
            light: '#f3e5f5',
            dark: '#ab47bc',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ffa726',
        },
        info: {
            main: '#29b6f6',
        },
        success: {
            main: '#66bb6a',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    borderRadius: 12,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#424242',
                        },
                        '&:hover fieldset': {
                            borderColor: '#90caf9',
                        },
                    },
                },
            },
        },
        MuiStepper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    color: '#b0bec5',
                    '&.Mui-active': {
                        color: '#90caf9',
                    },
                    '&.Mui-completed': {
                        color: '#66bb6a',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1e1e1e',
                    borderRadius: 12,
                },
            },
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default darkTheme;