import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { EvaluationType } from '../modules.schema';

export class CreateModuleDto {
  @IsString()
  nom: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  descriptionCourte?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nombreHeuresTotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coefficient?: number;

  @IsOptional()
  @IsMongoId()
  intervenantPrincipalId?: string;

  @IsOptional()
  @IsString()
  semestre?: string;

  @IsOptional()
  @IsEnum(EvaluationType)
  typeEvaluationPrincipal?: EvaluationType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  poidsEvaluation?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}

