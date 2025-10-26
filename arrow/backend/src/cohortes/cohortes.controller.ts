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
    Optional,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { CohortesService } from './cohortes.service';
  import { CreateCohorteDto } from './dto/create-cohorte.dto';
  import { UpdateCohorteDto } from './dto/update-cohorte.dto';
  import { AssignStudentsDto } from './dto/assign-students.dto';
  import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
  
  @ApiTags('cohortes')
  @Controller('cohortes')
  @UseGuards(DevAuthGuard)
  @ApiBearerAuth()
  export class CohortesController {
    constructor(private readonly cohortesService: CohortesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle cohorte' })
    @ApiResponse({ status: 201, description: 'Cohorte créée avec succès' })
    create(@Body() createCohorteDto: CreateCohorteDto) {
      return this.cohortesService.create(createCohorteDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Liste toutes les cohortes' })
    @ApiResponse({ status: 200, description: 'Liste des cohortes récupérée' })
    findAll() {
      return this.cohortesService.findAll();
    }
  
    @Get('stats')
    @ApiOperation({ summary: 'Statistiques des cohortes' })
    getStats() {
      return this.cohortesService.getStats();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Détails d\'une cohorte' })
    @ApiResponse({ status: 200, description: 'Cohorte trouvée' })
    @ApiResponse({ status: 404, description: 'Cohorte non trouvée' })
    findOne(@Param('id') id: string) {
      return this.cohortesService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une cohorte' })
    @ApiResponse({ status: 200, description: 'Cohorte mise à jour' })
    @ApiResponse({ status: 404, description: 'Cohorte non trouvée' })
    update(@Param('id') id: string, @Body() updateCohorteDto: UpdateCohorteDto) {
      return this.cohortesService.update(id, updateCohorteDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer une cohorte' })
    @ApiResponse({ status: 204, description: 'Cohorte supprimée' })
    @ApiResponse({ status: 404, description: 'Cohorte non trouvée' })
    remove(@Param('id') id: string) {
      return this.cohortesService.remove(id);
    }
  
    @Post(':id/etudiants')
    @ApiOperation({ summary: 'Assigner des étudiants à une cohorte' })
    assignStudents(@Param('id') id: string, @Body() assignStudentsDto: AssignStudentsDto) {
      return this.cohortesService.assignStudents(id, assignStudentsDto);
    }
  
    @Post(':id/intervenants/:intervenantId')
    @ApiOperation({ summary: 'Assigner un intervenant' })
    assignIntervenant(
      @Param('id') id: string,
      @Param('intervenantId') intervenantId: string,
      @Body('volumeHoraire') @Optional() volumeHoraire?: number,
    ) {
      return this.cohortesService.assignIntervenant(id, intervenantId, volumeHoraire);
    }
  
    @Delete(':id/intervenants/:intervenantId')
    @ApiOperation({ summary: 'Retirer un intervenant d\'une cohorte' })
    removeIntervenant(@Param('id') id: string, @Param('intervenantId') intervenantId: string) {
      return this.cohortesService.removeIntervenant(id, intervenantId);
    }
  }