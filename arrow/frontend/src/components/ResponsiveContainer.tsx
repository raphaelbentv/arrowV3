import React from 'react';
import { Box } from '@mui/material';

const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',  // Mobile
          sm: '90%',   // Tablette
          md: '80%',   // Petit écran de PC
          lg: '70%',   // Grand écran
          xl: '60%',   // Très grand écran
        },
        margin: '0 auto',
        padding: {
          xs: '1rem',
          sm: '2rem',
          md: '3rem',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer; 