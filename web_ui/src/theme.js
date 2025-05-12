import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1a237e',
            light: '#534bae',
            dark: '#000051',
        },
        secondary: {
            main: '#283593',
            light: '#5f5fc4',
            dark: '#001064',
        },
        background: {
            default: '#0a1929',
            paper: '#132f4c',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b2bac2',
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
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                        width: 8,
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#132f4c',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#0a1929',
                        '& fieldset': {
                            borderColor: '#1a237e',
                        },
                        '&:hover fieldset': {
                            borderColor: '#534bae',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0a1929',
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
                    color: '#b2bac2',
                    '&.Mui-active': {
                        color: '#1a237e',
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
                    backgroundColor: '#132f4c',
                    borderRadius: 12,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0a1929',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #1a237e',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#1a237e',
                    },
                },
            },
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            color: '#ffffff',
        },
        h6: {
            fontWeight: 500,
            color: '#ffffff',
        },
        body1: {
            color: '#b2bac2',
        },
        body2: {
            color: '#b2bac2',
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default darkTheme;