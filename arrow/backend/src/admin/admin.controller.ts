import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // Routes protégées nécessitant une authentification et des droits d'admin
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Créer un nouvel administrateur' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Administrateur créé avec succès' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Un administrateur avec cet email existe déjà' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Récupérer tous les administrateurs' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste des administrateurs récupérée avec succès' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  async findAllAdmins() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Récupérer un administrateur par son ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur trouvé' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  async findAdminById(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur mis à jour avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  async updateAdmin(@Param('id') id: string, @Body() updateData: Partial<CreateAdminDto>) {
    return this.adminService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Supprimer un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur supprimé avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Non autorisé' })
  async removeAdmin(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // Route publique pour initialiser un admin (à désactiver en production)
  @Post('init-admin')
  @ApiOperation({ summary: 'Initialiser un administrateur par défaut (à désactiver en production)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Administrateur créé avec succès' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Un administrateur existe déjà' })
  async initAdmin(): Promise<any> {
    // Vérifier si un admin existe déjà
    const existingAdmin = await this.adminService.findByEmail('admin@example.com');
    
    if (existingAdmin) {
      return { 
        status: HttpStatus.OK,
        message: 'Un administrateur existe déjà' 
      };
    }
    
    // Créer un nouvel administrateur
    const admin = await this.adminService.createAdmin({
      email: 'admin@example.com',
      password: 'admin123', // Sera hashé par le service
      nom: 'Admin',
      prenom: 'User',
    });
    
    return { 
      status: HttpStatus.CREATED,
      message: 'Administrateur créé avec succès',
      adminId: admin._id
    };
  }
}