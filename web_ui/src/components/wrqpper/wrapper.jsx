import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import Auth from '../auth/auth';

const Wrapper = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Auth>
        {children}
      </Auth>
    </ThemeProvider>
  );
};

export default Wrapper;