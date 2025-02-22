import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const handleAddIntervenant = () => {
    navigate('/add-intervenant');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 2 }}>
      <Button variant="contained" color="primary" onClick={handleAddIntervenant}>
        Ajouter un Intervenant
      </Button>
      {/* Ajoutez d'autres boutons d'actions rapides ici */}
    </Box>
  );
};

export default QuickActions; 