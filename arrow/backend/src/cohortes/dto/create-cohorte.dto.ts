import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional, IsArray, IsNumber, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeFormation, StatutCohorte, TypeFinancement } from '../cohortes.schema';

export class CreateCohorteDto {
  // 🧱 Informations générales
  @ApiProperty({ example: 'BTS COM1 2024–2025' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: '2024-2025' })
  @IsString()
  @IsNotEmpty()
  anneeScolaire: string;

  @ApiProperty({ enum: TypeFormation, example: TypeFormation.BTS })
  @IsEnum(TypeFormation)
  @IsNotEmpty()
  typeFormation: TypeFormation;

  @ApiProperty({ example: 'BTS Communication', required: false })
  @IsString()
  @IsOptional()
  diplomeVise?: string;

  @ApiProperty({ example: 'Niveau 5', required: false })
  @IsString()
  @IsOptional()
  niveauRNCP?: string;

  @ApiProperty({ example: 'École Supérieure de Commerce', required: false })
  @IsString()
  @IsOptional()
  etablissement?: string;

  @ApiProperty({ example: 'REF-FORM-001', required: false })
  @IsString()
  @IsOptional()
  formationAssociee?: string;

  // 👥 Composition
  @ApiProperty({ example: 25, default: 0 })
  @IsNumber()
  @IsOptional()
  nombreEtudiantsPrevu?: number;

  @ApiProperty({ example: 20, default: 0 })
  @IsNumber()
  @IsOptional()
  nombreEtudiantsInscrits?: number;

  @ApiProperty({ example: 'professeur@ecole.fr', required: false })
  @IsEmail()
  @IsOptional()
  responsablePedagogique?: string;

  // 📅 Organisation et planification
  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  @IsNotEmpty()
  dateDebut: Date;

  @ApiProperty({ example: '2025-06-30' })
  @IsDateString()
  @IsNotEmpty()
  dateFin: Date;

  @ApiProperty({ example: 1200, default: 0 })
  @IsNumber()
  @IsOptional()
  volumeHoraireTotal?: number;

  // 📂 Structure pédagogique
  @ApiProperty({ example: ['Communication', 'Marketing', 'Gestion'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  matieres?: string[];

  @ApiProperty({ example: ['Module 1', 'Module 2'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modules?: string[];

  @ApiProperty({ example: 'Progression standard BTS COM', required: false })
  @IsString()
  @IsOptional()
  progressionPedagogique?: string;

  // 🔍 Suivi administratif et financier
  @ApiProperty({ enum: StatutCohorte, example: StatutCohorte.EN_PREPARATION })
  @IsEnum(StatutCohorte)
  @IsOptional()
  statut?: StatutCohorte;

  @ApiProperty({ example: 15, default: 0 })
  @IsNumber()
  @IsOptional()
  nombreEtudiantsFinances?: number;

  @ApiProperty({ example: 5, default: 0 })
  @IsNumber()
  @IsOptional()
  nombreEtudiantsAutofinances?: number;

  @ApiProperty({ example: 50000, default: 0 })
  @IsNumber()
  @IsOptional()
  montantTotalFacture?: number;

  @ApiProperty({ enum: TypeFinancement, example: TypeFinancement.OPCO, required: false })
  @IsEnum(TypeFinancement)
  @IsOptional()
  typeFinanceur?: TypeFinancement;

  @ApiProperty({ example: 'OPCO EP', required: false })
  @IsString()
  @IsOptional()
  nomFinanceur?: string;

  // 🧾 Métadonnées et traçabilité
  @ApiProperty({ example: 'admin@ecole.fr' })
  @IsEmail()
  @IsNotEmpty()
  creePar: string;

  @ApiProperty({ example: 'Formation intensive, groupe motivé', required: false })
  @IsString()
  @IsOptional()
  commentairesInternes?: string;

  @ApiProperty({ example: ['prioritaire', 'nouvelle-promo'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  // Champs legacy pour compatibilité
  @ApiProperty({ example: 'Description de la cohorte', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}