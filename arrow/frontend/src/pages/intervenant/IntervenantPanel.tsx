import React from 'react';
import { Container, Typography } from '@mui/material';

const IntervenantPanel: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel Intervenant
      </Typography>
      <Typography variant="body1">
        Bienvenue dans votre espace intervenant
      </Typography>
    </Container>
  );
};

export default IntervenantPanel; 