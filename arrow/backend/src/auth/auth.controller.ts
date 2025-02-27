 
 
import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Request() req: { user: any }): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  getProfile(@Request() req: { user: { userId: string } }): Promise<any> {
    return this.authService.getProfile(req.user.userId);
  }

  // Endpoint temporaire pour créer un admin (à désactiver en production)
  @Post('init-admin')
  async initAdmin(): Promise<any> {
    // Vérifier si un admin existe déjà
    const existingAdmin = await this.usersService.findByEmail('admin@example.com');
    
    if (existingAdmin) {
      return { message: 'Un administrateur existe déjà' };
    }
    
    // Créer un nouvel administrateur
    const admin = await this.usersService.create({
      email: 'admin@example.com',
      password: 'admin123', // Sera hashé par le service
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    return { 
      message: 'Administrateur créé avec succès',
      adminId: admin._id
    };
  }
} 