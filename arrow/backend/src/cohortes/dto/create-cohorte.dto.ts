import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsEnum, IsMongoId, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatutCohorte } from '../cohortes.schema';
import { Type } from 'class-transformer';

class CompositionEtudiantDto {
  @ApiProperty({ description: "ID de l'étudiant", example: '665f2f3a9a0f1a2b3c4d5e6f' })
  @IsMongoId()
  etudiantId: string;

  @ApiProperty({ description: "Date d'inscription", example: '2024-09-01' })
  @IsDateString()
  dateInscription: string;

  @ApiProperty({ enum: ['Actif', 'Abandon'], example: 'Actif' })
  @IsString()
  @IsOptional()
  statut?: 'Actif' | 'Abandon';
}

class PlanningModuleDto {
  @ApiProperty({ example: 'Lundi' })
  @IsString()
  jourSemaine: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  heureDebut: string;

  @ApiProperty({ example: '12:00' })
  @IsString()
  heureFin: string;

  @ApiProperty({ example: 'Salle B12' })
  @IsString()
  salle: string;
}

class ModuleCohorteDto {
  @ApiProperty({ description: 'ID du module', example: '665f2f3a9a0f1a2b3c4d5e6f' })
  @IsMongoId()
  moduleId: string;

  @ApiProperty({ description: "ID de l'intervenant assigné", example: '665f2f3a9a0f1a2b3c4d5e6f' })
  @IsMongoId()
  intervenantId: string;

  @ApiProperty({ type: PlanningModuleDto })
  @ValidateNested()
  @Type(() => PlanningModuleDto)
  planning: PlanningModuleDto;
}

export class CreateCohorteDto {
  // Identification
  @ApiProperty({ example: 'BTS Commerce 2024' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'BTS-COM-24' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  dateDebut: string;

  @ApiProperty({ example: '2025-06-30' })
  @IsDateString()
  dateFinPrevue: string;

  @ApiProperty({ enum: StatutCohorte, example: StatutCohorte.ACTIVE, required: false })
  @IsEnum(StatutCohorte)
  @IsOptional()
  statut?: StatutCohorte;

  // Références externes
  @ApiProperty({ description: 'ID du responsable pédagogique', required: false })
  @IsMongoId()
  @IsOptional()
  responsablePedagogiqueId?: string;

  // Composition
  @ApiProperty({ type: [CompositionEtudiantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompositionEtudiantDto)
  @IsOptional()
  composition?: CompositionEtudiantDto[];

  // Modules
  @ApiProperty({ type: [ModuleCohorteDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleCohorteDto)
  @IsOptional()
  modulesCohorte?: ModuleCohorteDto[];

  // Statistiques (calculées, non requises à la création)
  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  nombreTotalEtudiants?: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  nombreEtudiantsActifs?: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  tauxPresenceGlobal?: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  moyenneGenerale?: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  tauxAbandon?: number;

  // Métadonnées
  @ApiProperty({ description: 'ID user créateur', required: false })
  @IsMongoId()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({ description: 'ID user dernier modificateur', required: false })
  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}