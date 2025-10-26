import React from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { School, Users, Clock, Euro } from 'lucide-react';
import { Cohorte, StatutCohorte } from '../../types/cohorte';

interface CohorteCardProps {
  cohorte: Cohorte;
  onEdit?: (cohorte: Cohorte) => void;
  onDelete?: (id: string) => void;
  onView?: (cohorte: Cohorte) => void;
}

export const CohorteCard: React.FC<CohorteCardProps> = ({
  cohorte,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatutLabel = (statut: StatutCohorte) => {
    switch (statut) {
      case StatutCohorte.EN_PREPARATION:
        return 'En préparation';
      case StatutCohorte.ACTIVE:
        return 'Active';
      case StatutCohorte.CLOTUREE:
        return 'Clôturée';
      default:
        return 'Inconnu';
    }
  };

  const getStatutBadgeClass = (statut: StatutCohorte) => {
    switch (statut) {
      case StatutCohorte.EN_PREPARATION:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case StatutCohorte.ACTIVE:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case StatutCohorte.CLOTUREE:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-black/40 border border-vaporwave/30 hover:border-vaporwave hover:shadow-lg hover:shadow-vaporwave/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <CardContent className="flex-1 p-6">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-white mb-2">
              {cohorte.nom}
            </CardTitle>
            <p className="text-vaporwave-sky text-sm mb-1">
              {cohorte.typeFormation} - {cohorte.anneeScolaire}
            </p>
            {cohorte.etablissement && (
              <p className="text-gray-400 text-xs">
                {cohorte.etablissement}
              </p>
            )}
          </div>
          <Badge className={getStatutBadgeClass(cohorte.statut)}>
            {getStatutLabel(cohorte.statut)}
          </Badge>
        </div>

        <div className="border-t border-vaporwave/20 my-4" />

        {/* Informations principales */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-vaporwave-sky" />
              <span className="text-sm font-medium text-gray-300">Étudiants</span>
            </div>
            <p className="text-sm text-gray-400">
              {cohorte.nombreEtudiantsInscrits} / {cohorte.nombreEtudiantsPrevu}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-vaporwave-sky" />
              <span className="text-sm font-medium text-gray-300">Volume horaire</span>
            </div>
            <p className="text-sm text-gray-400">
              {cohorte.volumeHoraireTotal}h
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-4 h-4 text-vaporwave-sky" />
              <span className="text-sm font-medium text-gray-300">Intervenants</span>
            </div>
            <p className="text-sm text-gray-400">
              {cohorte.intervenants.length}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Euro className="w-4 h-4 text-vaporwave-sky" />
              <span className="text-sm font-medium text-gray-300">Montant</span>
            </div>
            <p className="text-sm text-gray-400">
              {cohorte.montantTotalFacture.toLocaleString('fr-FR')}€
            </p>
          </div>
        </div>

        {/* Période */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-1">Période</p>
          <p className="text-sm text-gray-400">
            {formatDate(cohorte.dateDebut)} - {formatDate(cohorte.dateFin)}
          </p>
        </div>

        {/* Tags */}
        {cohorte.tags && cohorte.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {cohorte.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="text-xs bg-vaporwave-blue/20 text-vaporwave-blue border-vaporwave-blue/30">
                {tag}
              </Badge>
            ))}
            {cohorte.tags.length > 3 && (
              <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                +{cohorte.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {cohorte.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {cohorte.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4">
          {onView && (
            <Button
              size="sm"
              variant="default"
              className="flex-1 bg-vaporwave-blue hover:bg-vaporwave-light text-white"
              onClick={() => onView(cohorte)}
            >
              Voir
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-vaporwave-blue text-vaporwave-blue hover:bg-vaporwave-blue/10"
              onClick={() => onEdit(cohorte)}
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => onDelete(cohorte._id)}
            >
              Supprimer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
