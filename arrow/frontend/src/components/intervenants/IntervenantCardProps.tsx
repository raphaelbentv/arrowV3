import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../../types/intervenant';

interface IntervenantCardProps {
  intervenant: Intervenant;
  email: string;
  telephone: string;
  domainesExpertise: string[];
}

const IntervenantCard: React.FC<IntervenantCardProps> = ({
  intervenant,
  email,
  telephone,
  domainesExpertise
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardActionArea onClick={() => navigate(`/intervenants/${intervenant._id}`)}>
        <Box sx={{ display: 'flex', p: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: 'primary.main',
              mr: 2
            }}
          >
            {intervenant.nom[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {intervenant.nom} {intervenant.prenom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intervenant.poste}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intervenant.statut}
            </Typography>
          </Box>
        </Box>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Email: {email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Téléphone: {telephone}
          </Typography>
          {domainesExpertise.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Domaines: {domainesExpertise.join(', ')}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default IntervenantCard;