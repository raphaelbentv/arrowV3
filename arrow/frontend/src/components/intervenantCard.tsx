import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';

interface IntervenantCardProps {
  intervenant: Intervenant;
}

const IntervenantCard: React.FC<IntervenantCardProps> = ({ intervenant }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ minWidth: 250, maxWidth: 300 }}>
      <CardActionArea
        sx={{
          minHeight: '280px',
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          p: 2,
          '& .MuiCardContent-root': {
            flexGrow: 1,
            minHeight: '150px',
          },
          '& .MuiBox-root': {
            minHeight: '80px',
          }
        }}
        onClick={() => navigate(`/intervenants/${intervenant._id}`)}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2
        }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main'
            }}
          >
            {intervenant.prenom[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" component="h6">
              {intervenant.prenom} {intervenant.nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intervenant.poste}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intervenant.statut}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Email: {intervenant.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Téléphone: {intervenant.telephone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Domaines: {intervenant.domainesExpertise?.join(', ')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default IntervenantCard;
