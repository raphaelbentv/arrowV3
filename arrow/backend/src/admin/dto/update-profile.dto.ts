import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  prenom?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telephoneMobile?: string;

  @IsString()
  @IsOptional()
  telephoneFixe?: string;

  @IsString()
  @IsOptional()
  posteFonction?: string;

  @IsUrl()
  @IsOptional()
  photo?: string;
}


