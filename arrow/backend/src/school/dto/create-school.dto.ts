import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  nomEcole: string;

  @IsString()
  @IsOptional()
  raisonSociale?: string;

  @IsString()
  numeroSIRET: string;

  @IsString()
  @IsOptional()
  codeUAI?: string;

  @IsString()
  adresseNumeroRue: string;

  @IsString()
  codePostal: string;

  @IsString()
  ville: string;

  @IsString()
  pays: string;

  @IsString()
  telephone: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  siteWeb?: string;

  @IsString()
  nomDirecteur: string;

  @IsEmail()
  emailDirecteur: string;

  @IsString()
  nomResponsablePedagogique: string;

  @IsEmail()
  emailResponsablePedagogique: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  couleurPrincipale?: string;
}

