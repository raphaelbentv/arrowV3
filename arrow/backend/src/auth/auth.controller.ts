import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  // Version temporaire pour le développement
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur (mode développement)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  login(@Body() loginDto: LoginDto): any {
    // Retourner un utilisateur fictif pour le développement
    return {
      access_token: 'dev_token',
      user: {
        _id: 'dev_id',
        email: loginDto.email,
        nom: 'Admin',
        prenom: 'Dev',
        isAdmin: true,
      }
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  getProfile(): any {
    // Retourner un profil fictif pour le développement
    return {
      _id: 'dev_id',
      email: 'admin@dev.com',
      nom: 'Admin',
      prenom: 'Dev',
      isAdmin: true,
    };
  }
} 