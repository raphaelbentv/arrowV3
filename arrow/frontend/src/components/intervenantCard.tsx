import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../types/intervenant';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IntervenantCardProps {
  intervenant: Intervenant;
}

const IntervenantCard: React.FC<IntervenantCardProps> = ({ intervenant }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="min-w-[250px] max-w-[300px] cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      onClick={() => navigate(`/intervenants/${intervenant._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-14 w-14 bg-primary">
            <AvatarFallback className="text-white font-bold">
              {intervenant.prenom?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {intervenant.prenom} {intervenant.nom}
            </h3>
            <p className="text-sm text-muted-foreground">
              {intervenant.poste}
            </p>
            <p className="text-sm text-muted-foreground">
              {intervenant.statut}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Email: {intervenant.email}
          </p>
          <p className="text-muted-foreground">
            Téléphone: {intervenant.telephone}
          </p>
          <p className="text-muted-foreground">
            Domaines: {intervenant.domainesExpertise?.join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntervenantCard;
