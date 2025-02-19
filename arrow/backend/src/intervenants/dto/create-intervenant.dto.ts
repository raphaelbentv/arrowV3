/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateIntervenantDto {
  // Informations personnelles
  @IsNotEmpty()
  @IsString()
  readonly nom: string;

  @IsNotEmpty()
  @IsString()
  readonly prenom: string;

  @IsOptional()
  @IsString()
  readonly photo?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly telephone: string;
  
  @IsOptional()
  @IsString()
  readonly adresse?: string;

  @IsOptional()
  @IsDateString()
  readonly dateNaissance?: Date;

  // Informations professionnelles
  @IsNotEmpty()
  @IsString()
  readonly poste: string;

  @IsNotEmpty()
  @IsString()
  readonly statut: string;

  @IsOptional()
  @IsString()
  readonly experience?: string;

  @IsOptional()
  @IsArray()
  readonly domainesExpertise?: string[];

  @IsOptional()
  @IsString()
  readonly diplomes?: string;

  @IsOptional()
  @IsString()
  readonly cv?: string;

  // Données contractuelles
  @IsNotEmpty()
  @IsString()
  readonly typeContrat: string;

  @IsOptional()
  @IsDateString()
  readonly dateDebutMission?: Date;

  @IsOptional()
  @IsDateString()
  readonly dateFinMission?: Date;

  @IsOptional()
  @IsString()
  readonly tarification?: string;

  @IsOptional()
  @IsNumber()
  readonly heuresPrevues?: number;

  @IsOptional()
  @IsString()
  readonly rib?: string;

  @IsOptional()
  @IsString()
  readonly clauses?: string;

  // Informations pédagogiques
  @IsOptional()
  @IsArray()
  readonly modulesEnseignes?: string[];

  @IsOptional()
  @IsNumber()
  readonly heuresParModule?: number;

  @IsOptional()
  @IsString()
  readonly niveauEtudiants?: string;

  @IsOptional()
  @IsString()
  readonly supportsPedagogiques?: string;

  @IsOptional()
  @IsString()
  readonly methodesPedagogiques?: string;

  // Documents administratifs
  @IsOptional()
  @IsString()
  readonly pieceIdentite?: string;

  @IsOptional()
  @IsString()
  readonly numeroSiret?: string;

  @IsOptional()
  @IsString()
  readonly assuranceRC?: string;

  @IsOptional()
  @IsString()
  readonly extraitKbis?: string;

  @IsOptional()
  @IsString()
  readonly justificatifsDiplomes?: string;

  @IsOptional()
  @IsString()
  readonly conventionContrat?: string;

  @IsOptional()
  @IsString()
  readonly attestationURSSAF?: string;

  // Suivi et évaluation
  @IsOptional()
  @IsArray()
  readonly appreciationsEtudiants?: string[];

  @IsOptional()
  @IsArray()
  readonly feedbackResponsables?: string[];

  @IsOptional()
  @IsString()
  readonly pointsAmelioration?: string;

  @IsOptional()
  @IsString()
  readonly disponibilites?: string;

  @IsOptional()
  @IsString()
  readonly engagement?: string;
}