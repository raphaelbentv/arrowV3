import React from 'react';
import { Box } from '@mui/material';
import Navigation from '../components/Navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Navigation />
      {children}
    </Box>
  );
};

export default AuthenticatedLayout; 