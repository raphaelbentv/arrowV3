import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EtudiantsService } from './etudiants.service';
import { CreateEtudiantDto } from './dtos/create-etudiant.dto';
import { UpdateEtudiantDto } from './dtos/update-etudiant.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { Etudiant } from './etudiants.schema';

@ApiTags('etudiants')
@ApiBearerAuth()
@Controller('etudiants')
@UseGuards(DevAuthGuard)
export class EtudiantsController {
  constructor(private readonly etudiantsService: EtudiantsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel étudiant' })
  @ApiResponse({ status: 201, description: 'Étudiant créé avec succès', type: Etudiant })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
    return await this.etudiantsService.create(createEtudiantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les étudiants' })
  @ApiQuery({ name: 'cohorte', required: false, description: 'Filtrer par ID de cohorte' })
  @ApiResponse({ status: 200, description: 'Liste des étudiants récupérée avec succès', type: [Etudiant] })
  async findAll(@Query('cohorte') cohorteId?: string): Promise<Etudiant[]> {
    if (cohorteId) {
      return await this.etudiantsService.findByCohorte(cohorteId);
    }
    return await this.etudiantsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques des étudiants' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès' })
  async getStats() {
    return await this.etudiantsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un étudiant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant récupéré avec succès', type: Etudiant })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  async findOne(@Param('id') id: string): Promise<Etudiant> {
    return await this.etudiantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un étudiant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 200, description: 'Étudiant mis à jour avec succès', type: Etudiant })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateEtudiantDto: UpdateEtudiantDto,
  ): Promise<Etudiant> {
    return await this.etudiantsService.update(id, updateEtudiantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un étudiant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'étudiant' })
  @ApiResponse({ status: 204, description: 'Étudiant supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Étudiant non trouvé' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.etudiantsService.delete(id);
  }
}
