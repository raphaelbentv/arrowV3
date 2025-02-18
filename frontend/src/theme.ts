import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#252525',
    },
    secondary: {
      main: '#FFD700',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#252525',
        },
      },
    },
  },
}); 