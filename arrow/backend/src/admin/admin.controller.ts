import { Controller, Post, Body, Delete, Get, HttpStatus, Param, Put, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  // Route publique pour créer un admin (mode développement)
  @Post()
  @ApiOperation({ summary: 'Créer un nouvel administrateur' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Administrateur créé avec succès' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Un administrateur avec cet email existe déjà' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    console.log('📝 Création d\'admin via API:', createAdminDto);
    return this.adminService.createAdmin(createAdminDto);
  }

  // Route publique pour lister les admins (mode développement)
  @Get()
  @ApiOperation({ summary: 'Récupérer tous les administrateurs' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste des administrateurs récupérée avec succès' })
  async findAllAdmins() {
    console.log('📋 Récupération de la liste des admins');
    return this.adminService.findAll();
  }

  // Route publique pour récupérer un admin par ID (mode développement)
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un administrateur par son ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur trouvé' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  async findAdminById(@Param('id') id: string) {
    console.log('🔍 Recherche d\'admin par ID:', id);
    return this.adminService.findById(id);
  }

  // Route publique pour mettre à jour un admin (mode développement)
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur mis à jour avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  async updateAdmin(@Param('id') id: string, @Body() updateData: Partial<CreateAdminDto>) {
    console.log('✏️ Mise à jour d\'admin:', id, updateData);
    return this.adminService.update(id, updateData);
  }

  // Route publique pour supprimer un admin (mode développement)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Administrateur supprimé avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  async removeAdmin(@Param('id') id: string) {
    console.log('🗑️ Suppression d\'admin:', id);
    return this.adminService.remove(id);
  }

  // Route publique pour initialiser un admin (à désactiver en production)
  @Post('initial')
  @ApiOperation({ summary: 'Initialiser un administrateur par défaut (à désactiver en production)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Administrateur créé avec succès' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Un administrateur existe déjà' })
  async createInitialAdmin(@Body() adminData: any) {
    console.log('🚀 Création d\'admin initial:', adminData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.adminService.createAdmin(adminData);
  }

  // Route pour changer le mot de passe
  @Patch(':id/password')
  @ApiOperation({ summary: 'Changer le mot de passe d\'un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Mot de passe changé avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé ou mot de passe incorrect' })
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return this.adminService.changePassword(id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
  }

  // Route pour mettre à jour le profil (sans mot de passe)
  @Patch(':id/profile')
  @ApiOperation({ summary: 'Mettre à jour le profil d\'un administrateur' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profil mis à jour avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Administrateur non trouvé' })
  async updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.adminService.update(id, updateProfileDto);
  }
}
