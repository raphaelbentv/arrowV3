/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, UseGuards, Delete, Get, HttpStatus, Param, Put, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminGuard } from './guards/admin.guard';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService
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
  @Post('initial')
  @ApiOperation({ summary: 'Initialiser un administrateur par défaut (à désactiver en production)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Administrateur créé avec succès' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Un administrateur existe déjà' })
  async createInitialAdmin(@Body() adminData: any) {
    console.log('Données reçues:', adminData);

    const uri = 'mongodb+srv://raphaelbentv:UraRJervWInvUFJW@cluster0.d7cns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log('Connecté à la base de données');

      const database = client.db('arrow');
      const adminsCollection = database.collection('admins');

      console.log('Collection sélectionnée:', adminsCollection.collectionName);

      const existingAdmin = await adminsCollection.findOne({ email: adminData.email });
      console.log('Admin existant:', existingAdmin);

      if (existingAdmin) {
        throw new Error('Un administrateur existe déjà avec cet email');
      }

      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      const admin = {
        email: adminData.email,
        password: hashedPassword,
        nom: adminData.nom,
        prenom: adminData.prenom,
        isAdmin: true,
        permissions: ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Admin à créer:', { ...admin, password: '***' });

      const result = await adminsCollection.insertOne(admin);
      console.log('Résultat de l\'insertion:', result);

      const { password, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;

    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw new InternalServerErrorException({
        message: 'Erreur lors de la création de l\'administrateur',
        details: error.message
      });
    } finally {
      await client.close();
      console.log('Connexion à la base de données fermée');
    }
  }
}