import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../../types/intervenant';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-105" onClick={() => navigate(`/intervenants/${intervenant._id}`)}>
      <div className="flex p-4">
        <Avatar className="h-14 w-14 bg-primary mr-4">
          <AvatarFallback className="text-white font-bold">
            {intervenant.nom?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {intervenant.nom} {intervenant.prenom}
          </h3>
          <p className="text-sm text-muted-foreground">
            {intervenant.poste}
          </p>
          <p className="text-sm text-muted-foreground">
            {intervenant.statut}
          </p>
        </div>
      </div>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Email: {email}
        </p>
        <p className="text-sm text-muted-foreground">
          Téléphone: {telephone}
        </p>
        {domainesExpertise.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Domaines: {domainesExpertise.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default IntervenantCard;
