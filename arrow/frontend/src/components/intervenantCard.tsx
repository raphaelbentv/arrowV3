import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Card, CardContent, Typography, CardActions, Button, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';
import { intervenantsService } from '../services/intervenants';
import SearchBar from './common/SearchBar';

interface IntervenantCardProps {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  statut: string;
  email: string;
  telephone: string;
  domainesExpertise?: string[];
}

const IntervenantCard: React.FC<IntervenantCardProps> = ({
  id,
  nom,
  prenom,
  poste,
  statut,
  email,
  telephone,
  domainesExpertise = []
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea onClick={() => navigate(`/intervenants/${id}`)}>
        <CardContent>
          <Typography variant="h6">
            {nom} {prenom}
          </Typography>
          <Typography color="text.secondary">
            {poste}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Email: {email}
            </Typography>
            <Typography variant="body2">
              Téléphone: {telephone}
            </Typography>
            {domainesExpertise.length > 0 && (
              <Typography variant="body2">
                Domaines: {domainesExpertise.join(', ')}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default IntervenantCard;
