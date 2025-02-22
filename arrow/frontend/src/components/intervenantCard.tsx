import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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
  domainesExpertise = [],
}) => {
  return (
    <MuiLink component={RouterLink} to={`/intervenants/${id}`} underline="none">
      <Card sx={{ padding: 2, marginBottom: 2, cursor: 'pointer' }}>
        <Box sx={{ marginBottom: 2 }}>
          <Avatar sx={{ marginRight: 2, bgcolor: 'primary.main' }}>{nom[0]}</Avatar>
          <Box>
            <Typography variant="h6">{`${nom} ${prenom}`}</Typography>
            <Typography color="text.secondary">{`Poste: ${poste}`}</Typography>
            <Typography color="text.secondary">{`Statut: ${statut}`}</Typography>
          </Box>
        </Box>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Email: <MuiLink href={`mailto:${email}`}>{email}</MuiLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Téléphone: <MuiLink href={`tel:${telephone}`}>{telephone}</MuiLink>
          </Typography>
          {domainesExpertise.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Domaines d'expertise: {domainesExpertise.join(', ')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </MuiLink>
  );
};

export default IntervenantCard;
