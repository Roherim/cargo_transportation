import { createTheme } from '@mui/material/styles';

// Создание темы с поддержкой Material 3
const theme = createTheme({
  palette: {
    mode: 'dark', // Тёмная тема
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#121212',
    },
  },
  // Включение Material 3 (если требуется)
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Пример стилизации для Material 3
        },
      },
    },
  },
});

export default theme;