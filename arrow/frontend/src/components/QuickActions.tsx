import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const handleAddIntervenant = () => {
    navigate('/add-intervenant');
  };

  return (
    <div className="flex justify-around p-4">
      <Button onClick={handleAddIntervenant}>
        Ajouter un Intervenant
      </Button>
    </div>
  );
};

export default QuickActions; 