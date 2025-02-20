import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntervenantDto {
  // Informations personnelles
  @ApiProperty({ example: 'Dupont', description: "Nom de l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly nom: string;

  @ApiProperty({ example: 'Jean', description: "Prénom de l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly prenom: string;

  @ApiProperty({ example: 'url/photo.jpg', description: "URL de la photo de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiProperty({ example: 'jean.dupont@email.com', description: "Email de l'intervenant" })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '0601020304', description: "Numéro de téléphone de l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly telephone: string;

  @ApiProperty({ example: '123 rue Example, 75000 Paris', description: "Adresse de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly adresse?: string;

  @ApiProperty({ example: '1990-01-01', description: "Date de naissance de l'intervenant", required: false })
  @IsOptional()
  @IsDateString()
  readonly dateNaissance?: Date;

  // Informations professionnelles
  @ApiProperty({ example: 'Développeur Web', description: "Poste occupé par l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly poste: string;

  @ApiProperty({ example: 'Freelance', description: "Statut professionnel de l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly statut: string;

  @ApiProperty({ example: '5 ans', description: "Expérience professionnelle de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly experience?: string;

  @ApiProperty({ example: ['Développement Web', 'Base de données'], description: "Domaines d'expertise de l'intervenant", required: false })
  @IsOptional()
  @IsArray()
  readonly domainesExpertise?: string[];

  @ApiProperty({ example: 'Master en Informatique', description: "Diplômes de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly diplomes?: string;

  @ApiProperty({ example: 'url/cv.pdf', description: "URL du CV de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly cv?: string;

  // Données contractuelles
  @ApiProperty({ example: 'CDD', description: "Type de contrat de l'intervenant" })
  @IsNotEmpty()
  @IsString()
  readonly typeContrat: string;

  @ApiProperty({ example: '2022-01-01', description: "Date de début de mission de l'intervenant", required: false })
  @IsOptional()
  @IsDateString()
  readonly dateDebutMission?: Date;

  @ApiProperty({ example: '2022-12-31', description: "Date de fin de mission de l'intervenant", required: false })
  @IsOptional()
  @IsDateString()
  readonly dateFinMission?: Date;

  @ApiProperty({ example: '500€/jour', description: "Tarification de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly tarification?: string;

  @ApiProperty({ example: 160, description: "Nombre d'heures prévues pour l'intervenant", required: false })
  @IsOptional()
  @IsNumber()
  readonly heuresPrevues?: number;

  @ApiProperty({ example: 'FR7630004000031234567890143', description: "RIB de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly rib?: string;

  @ApiProperty({ example: 'Clause de confidentialité', description: "Clauses contractuelles de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly clauses?: string;

  // Informations pédagogiques
  @ApiProperty({ example: ['Module 1', 'Module 2'], description: "Modules enseignés par l'intervenant", required: false })
  @IsOptional()
  @IsArray()
  readonly modulesEnseignes?: string[];

  @ApiProperty({ example: 20, description: "Nombre d'heures par module enseigné par l'intervenant", required: false })
  @IsOptional()
  @IsNumber()
  readonly heuresParModule?: number;

  @ApiProperty({ example: 'Licence', description: "Niveau des étudiants de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly niveauEtudiants?: string;

  @ApiProperty({ example: 'url/supports.pdf', description: "Supports pédagogiques de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly supportsPedagogiques?: string;

  @ApiProperty({ example: 'Méthode active', description: "Méthodes pédagogiques de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly methodesPedagogiques?: string;

  // Documents administratifs
  @ApiProperty({ example: 'url/piece-identite.pdf', description: "URL de la pièce d'identité", required: false })
  @IsOptional()
  @IsString()
  readonly pieceIdentite?: string;

  @ApiProperty({ example: '123456789', description: "Numéro SIRET", required: false })
  @IsOptional()
  @IsString()
  readonly numeroSiret?: string;

  @ApiProperty({ example: 'url/assurance-rc.pdf', description: "URL de l'assurance RC", required: false })
  @IsOptional()
  @IsString()
  readonly assuranceRC?: string;

  @ApiProperty({ example: 'url/extrait-kbis.pdf', description: "URL de l'extrait Kbis", required: false })
  @IsOptional()
  @IsString()
  readonly extraitKbis?: string;

  @ApiProperty({ example: 'url/justificatifs-diplomes.pdf', description: "URL des justificatifs de diplômes", required: false })
  @IsOptional()
  @IsString()
  readonly justificatifsDiplomes?: string;

  @ApiProperty({ example: 'url/convention-contrat.pdf', description: "URL de la convention de contrat", required: false })
  @IsOptional()
  @IsString()
  readonly conventionContrat?: string;

  @ApiProperty({ example: 'url/attestation-urssaf.pdf', description: "URL de l'attestation URSSAF", required: false })
  @IsOptional()
  @IsString()
  readonly attestationURSSAF?: string;

  // Suivi et évaluation
  @ApiProperty({ example: ['Excellent pédagogue'], description: "Appréciations des étudiants", required: false })
  @IsOptional()
  @IsArray()
  readonly appreciationsEtudiants?: string[];

  @ApiProperty({ example: ['Très professionnel'], description: "Feedback des responsables", required: false })
  @IsOptional()
  @IsArray()
  readonly feedbackResponsables?: string[];

  @ApiProperty({ example: 'Améliorer la gestion du temps', description: "Points d'amélioration de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly pointsAmelioration?: string;

  @ApiProperty({ example: 'Disponible les lundis et mercredis', description: "Disponibilités de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly disponibilites?: string;

  @ApiProperty({ example: 'Engagé à 100%', description: "Engagement de l'intervenant", required: false })
  @IsOptional()
  @IsString()
  readonly engagement?: string;
}