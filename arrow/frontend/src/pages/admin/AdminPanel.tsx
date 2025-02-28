import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminPanel: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel Administrateur
      </Typography>
      <Typography variant="body1">
        Bienvenue dans votre espace administrateur
      </Typography>
    </Container>
  );
};

export default AdminPanel; 