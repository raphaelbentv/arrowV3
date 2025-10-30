import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatutInscription, TypeFinancement } from '../etudiants.schema';

export class CreateEtudiantDto {
  // Informations personnelles
  @ApiProperty({ example: 'Dupont', description: 'Nom de l\'étudiant' })
  @IsNotEmpty()
  @IsString()
  readonly nom: string;

  @ApiProperty({ example: 'Marie', description: 'Prénom de l\'étudiant' })
  @IsNotEmpty()
  @IsString()
  readonly prenom: string;

  @ApiProperty({ example: 'url/photo.jpg', description: 'URL de la photo', required: false })
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiProperty({ example: 'marie.dupont@email.com', description: 'Email de l\'étudiant' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '0601020304', description: 'Numéro de téléphone' })
  @IsNotEmpty()
  @IsString()
  readonly telephone: string;

  @ApiProperty({ example: '123 rue Example, 75000 Paris', description: 'Adresse', required: false })
  @IsOptional()
  @IsString()
  readonly adresse?: string;

  @ApiProperty({ example: '2000-01-01', description: 'Date de naissance', required: false })
  @IsOptional()
  @IsDateString()
  readonly dateNaissance?: Date;

  @ApiProperty({ example: 'Paris', description: 'Lieu de naissance', required: false })
  @IsOptional()
  @IsString()
  readonly lieuNaissance?: string;

  @ApiProperty({ example: 'Française', description: 'Nationalité', required: false })
  @IsOptional()
  @IsString()
  readonly nationalite?: string;

  @ApiProperty({ example: 'M', enum: ['M', 'F', 'Autre'], description: 'Genre', required: false })
  @IsOptional()
  @IsEnum(['M', 'F', 'Autre'])
  readonly genre?: string;

  @ApiProperty({ example: 'ETU2024001', description: 'Numéro étudiant', required: false })
  @IsOptional()
  @IsString()
  readonly numeroEtudiant?: string;

  // Informations scolaires
  @ApiProperty({ example: StatutInscription.INSCRIT, enum: StatutInscription, description: 'Statut d\'inscription', default: StatutInscription.EN_ATTENTE })
  @IsOptional()
  @IsEnum(StatutInscription)
  readonly statutInscription?: StatutInscription;

  @ApiProperty({ example: '2024-09-01', description: 'Date d\'inscription', required: false })
  @IsOptional()
  @IsDateString()
  readonly dateInscription?: Date;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID de la cohorte actuelle', required: false })
  @IsOptional()
  @IsString()
  readonly cohorteActuelle?: string;

  @ApiProperty({ example: 'BTS Communication', description: 'Formation suivie', required: false })
  @IsOptional()
  @IsString()
  readonly formationSuivie?: string;

  @ApiProperty({ example: 'Bac+2', description: 'Niveau', required: false })
  @IsOptional()
  @IsString()
  readonly niveau?: string;

  // Documents
  @ApiProperty({ example: 'url/cv.pdf', description: 'URL du CV', required: false })
  @IsOptional()
  @IsString()
  readonly cv?: string;

  @ApiProperty({ example: 'url/lettre-motivation.pdf', description: 'URL de la lettre de motivation', required: false })
  @IsOptional()
  @IsString()
  readonly lettreMotivation?: string;

  @ApiProperty({ example: 'Baccalauréat Général', description: 'Diplômes', required: false })
  @IsOptional()
  @IsString()
  readonly diplomes?: string;

  @ApiProperty({ example: 'url/pieces-identite.pdf', description: 'URL des pièces d\'identité', required: false })
  @IsOptional()
  @IsString()
  readonly piecesIdentite?: string;

  @ApiProperty({ example: 'url/justificatifs.pdf', description: 'URL des justificatifs de financement', required: false })
  @IsOptional()
  @IsString()
  readonly justificatifsFinancement?: string;

  // Informations financières
  @ApiProperty({ example: TypeFinancement.BOURSE, enum: TypeFinancement, description: 'Type de financement', required: false })
  @IsOptional()
  @IsEnum(TypeFinancement)
  readonly typeFinancement?: TypeFinancement;

  @ApiProperty({ example: 5000, description: 'Montant du financement', required: false })
  @IsOptional()
  @IsNumber()
  readonly montantFinancement?: number;

  @ApiProperty({ example: 'CROUS', description: 'Organisme financeur', required: false })
  @IsOptional()
  @IsString()
  readonly organismeFinanceur?: string;

  @ApiProperty({ example: '2024-09-01', description: 'Date de début du financement', required: false })
  @IsOptional()
  @IsDateString()
  readonly dateDebutFinancement?: Date;

  @ApiProperty({ example: '2025-06-30', description: 'Date de fin du financement', required: false })
  @IsOptional()
  @IsDateString()
  readonly dateFinFinancement?: Date;

  // Suivi pédagogique
  @ApiProperty({ example: 14.5, description: 'Moyenne générale', required: false, minimum: 0, maximum: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  readonly moyenneGenerale?: number;

  @ApiProperty({ example: 85, description: 'Taux de présence (%)', required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly tauxPresence?: number;

  @ApiProperty({ example: 75, description: 'Taux de progression (%)', required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly tauxProgression?: number;

  // Informations complémentaires
  @ApiProperty({ example: 'Salarié', description: 'Situation actuelle', required: false })
  @IsOptional()
  @IsString()
  readonly situationActuelle?: string;

  @ApiProperty({ example: 'Obtenir un diplôme et trouver un emploi', description: 'Objectifs', required: false })
  @IsOptional()
  @IsString()
  readonly objectifs?: string;

  @ApiProperty({ example: 'Difficultés en mathématiques', description: 'Difficultés rencontrées', required: false })
  @IsOptional()
  @IsString()
  readonly difficultesRencontrees?: string;

  @ApiProperty({ example: 'Étudiant motivé et assidu', description: 'Commentaires', required: false })
  @IsOptional()
  @IsString()
  readonly commentaires?: string;

  @ApiProperty({ example: ['BTS', 'Présentiel'], description: 'Tags', required: false })
  @IsOptional()
  @IsArray()
  readonly tags?: string[];
}
