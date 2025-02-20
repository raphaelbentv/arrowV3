import { PartialType } from '@nestjs/mapped-types';
import { CreateIntervenantDto } from './create-intervenant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIntervenantDto extends PartialType(CreateIntervenantDto) {
  @ApiPropertyOptional({ example: 'Manager', description: "Nouveau poste" })
  poste?: string;

  @ApiPropertyOptional({ example: 'Freelance', description: "Nouveau statut" })
  statut?: string;

  @ApiPropertyOptional({ example: 'CDI', description: "Nouveau type de contrat" })
  typeContrat?: string;

  @ApiPropertyOptional({ example: 'john.doe@email.com', description: "Nouvelle adresse email" })
  email?: string;

  @ApiPropertyOptional({ example: '0601020304', description: "Nouveau numéro de téléphone" })
  telephone?: string;
}