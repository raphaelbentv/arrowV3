import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', // Votre jaune Arrow
    },
    secondary: {
      main: '#1a1a1a', // Votre couleur sombre Arrow
    },
    background: {
      default: '#1a1a1a',
      paper: '#252525',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});

export default theme; 