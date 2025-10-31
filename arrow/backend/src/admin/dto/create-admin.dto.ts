import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  // Champs optionnels
  @IsUrl()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  telephoneMobile?: string;

  @IsString()
  @IsOptional()
  telephoneFixe?: string;

  @IsString()
  @IsOptional()
  posteFonction?: string;

  // Le rôle est fixé à 'admin' dans le service, donc pas besoin de le valider ici
}