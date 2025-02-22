import { createTheme } from '@mui/material/styles';

// Définition des couleurs principales
const colors = {
  primary: {
    main: '#FFD700',
    light: '#FFE14D',
    dark: '#CCB100',
    contrastText: '#1A1A1A',
  },
  secondary: {
    main: '#1E1E1E',
    light: '#2D2D2D',
    dark: '#121212',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0a0a0a',     // Fond général encore plus sombre
    paper: '#1E1E1E',
    light: '#2D2D2D',
    dark: '#050505',        // Noir presque pur
    menu: '#0d0d0d',        // Barre de menu très sombre
    toolbar: '#111111',     // Toolbar très sombre
    outlined: 'rgba(255, 255, 255, 0.12)',  // Outlined container: 12% White
    filled: 'rgba(255, 255, 255, 0.12)',    // Filled container: 12% White
  },
  text: {
    primary: '#FFD700',
    secondary: '#FFFFFF',
    disabled: '#808080',
    label: 'rgba(255, 255, 255, 0.38)',     // Label/Icon: 38% White
  },
  error: {
    main: '#FF4444',
    light: '#FF7777',
    dark: '#CC0000',
  },
  success: {
    main: '#44FF44',
    light: '#77FF77',
    dark: '#00CC00',
  },
};

// Définition des espacements

const theme = createTheme({
  palette: {
    mode: 'dark',
    ...colors,
  },
  
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.text.primary,
      '@media (max-width:960px)': { fontSize: '2.5rem' },
      '@media (max-width:600px)': { fontSize: '2rem' },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
      '@media (max-width:960px)': { fontSize: '2rem' },
      '@media (max-width:600px)': { fontSize: '1.75rem' },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
      '@media (max-width:960px)': { fontSize: '1.75rem' },
      '@media (max-width:600px)': { fontSize: '1.5rem' },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': { fontSize: '0.95rem' },
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${colors.primary.main}, ${colors.primary.light})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary.light}, ${colors.primary.main})`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: colors.background.paper,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: colors.primary.light,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.background.toolbar,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: colors.background.menu,
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: colors.primary.light,
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            background: colors.background.light,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.background.outlined,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.20)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.text.label,
          '&.Mui-focused': {
            color: colors.primary.main,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.filled,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
          },
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: colors.text.label,
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          marginBottom: '2rem', // Marge par défaut entre les Box
          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c2c2c',
          padding: '24px',
          marginBottom: '32px', // Marge entre les Papers
          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .MuiGrid-item': {
            marginBottom: '24px', // Marge entre les éléments de la grille
          },
        },
        container: {
          marginBottom: '48px', // Marge plus importante entre les conteneurs de grille
          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h5: {
          marginTop: '48px', // Espace avant les titres de section
          marginBottom: '24px', // Espace après les titres de section
          '&:first-of-type': {
            marginTop: '16px',
          },
        },
        h6: {
          marginBottom: '16px', // Espace après les sous-titres
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,      // Mobile
      sm: 600,    // Tablette
      md: 960,    // Petit écran
      lg: 1280,   // Grand écran
      xl: 1920,   // Très grand écran
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.1)',
    '0px 16px 32px rgba(0,0,0,0.1)',
    '0px 20px 40px rgba(0,0,0,0.1)',
    '0px 24px 48px rgba(0,0,0,0.1)',
    '0px 28px 56px rgba(0,0,0,0.1)',
    '0px 32px 64px rgba(0,0,0,0.1)',
    '0px 36px 72px rgba(0,0,0,0.1)',
    '0px 40px 80px rgba(0,0,0,0.1)',
    '0px 44px 88px rgba(0,0,0,0.1)',
    '0px 48px 96px rgba(0,0,0,0.1)',
    '0px 52px 104px rgba(0,0,0,0.1)',
    '0px 56px 112px rgba(0,0,0,0.1)',
    '0px 60px 120px rgba(0,0,0,0.1)',
    '0px 64px 128px rgba(0,0,0,0.1)',
    '0px 68px 136px rgba(0,0,0,0.1)',
    '0px 72px 144px rgba(0,0,0,0.1)',
    '0px 76px 152px rgba(0,0,0,0.1)',
    '0px 80px 160px rgba(0,0,0,0.1)',
    '0px 84px 168px rgba(0,0,0,0.1)',
    '0px 88px 176px rgba(0,0,0,0.1)',
    '0px 92px 184px rgba(0,0,0,0.1)',
    // ... autres shadows
  ],

  spacing: (factor: number) => `${0.8 * factor}rem`, // Définition de l'unité d'espacement de base
});

export default theme;