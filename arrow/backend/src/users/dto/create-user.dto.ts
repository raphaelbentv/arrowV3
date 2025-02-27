import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Adresse email de l\'utilisateur' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;

  @ApiProperty({ example: 'John', description: 'Prénom de l\'utilisateur' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom de famille de l\'utilisateur' })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  lastName: string;

  @ApiProperty({ example: 'admin', description: 'Rôle de l\'utilisateur', enum: ['admin', 'intervenant', 'etudiant'] })
  @IsEnum(['admin', 'intervenant', 'etudiant'], { message: 'Le rôle doit être admin, intervenant ou etudiant' })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  role: string;
} 