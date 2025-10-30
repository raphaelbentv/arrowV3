import { PartialType } from '@nestjs/mapped-types';
import { CreateEtudiantDto } from './create-etudiant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatutInscription } from '../etudiants.schema';

export class UpdateEtudiantDto extends PartialType(CreateEtudiantDto) {
  @ApiPropertyOptional({ example: 'marie.dupont@email.com', description: 'Nouvelle adresse email' })
  email?: string;

  @ApiPropertyOptional({ example: '0601020304', description: 'Nouveau numéro de téléphone' })
  telephone?: string;

  @ApiPropertyOptional({ example: 'Inscrit', description: 'Nouveau statut d\'inscription' })
  statutInscription?: StatutInscription;
}
