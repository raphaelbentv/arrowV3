/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { IntervenantsService } from './intervenants.service';
import { CreateIntervenantDto } from './dtos/create-intervenant.dto';
import { UpdateIntervenantDto } from './dtos/update-intervenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Intervenant } from './intervenants.schema';

@ApiTags('intervenants')
@ApiBearerAuth()
@Controller('intervenants')
export class IntervenantsController {
  constructor(private readonly intervenantsService: IntervenantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un nouvel intervenant' })
  @ApiBody({ type: CreateIntervenantDto })
  @ApiResponse({ status: 201, description: 'Intervenant créé avec succès.', type: Intervenant })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  async create(@Body() createIntervenantDto: CreateIntervenantDto): Promise<Intervenant> {
    console.log('Données reçues pour création:', createIntervenantDto);
    try {
      return await this.intervenantsService.create(createIntervenantDto);
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer tous les intervenants' })
  @ApiResponse({ status: 200, description: 'Liste des intervenants récupérée avec succès.', type: [Intervenant] })
  async findAll(): Promise<Intervenant[]> {
    try {
      return await this.intervenantsService.findAll();
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer un intervenant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'intervenant' })
  @ApiResponse({ status: 200, description: 'Intervenant récupéré avec succès.', type: Intervenant })
  @ApiResponse({ status: 404, description: 'Intervenant non trouvé.' })
  async findOne(@Param('id') id: string): Promise<Intervenant> {
    try {
      return await this.intervenantsService.findOne(id);
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'intervenant')
  @ApiOperation({ summary: 'Mettre à jour un intervenant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'intervenant' })
  @ApiBody({ type: UpdateIntervenantDto })
  @ApiResponse({ status: 200, description: 'Intervenant mis à jour avec succès.', type: Intervenant })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @ApiResponse({ status: 404, description: 'Intervenant non trouvé.' })
  async update(@Param('id') id: string, @Body() updateIntervenantDto: UpdateIntervenantDto): Promise<Intervenant> {
    return this.intervenantsService.update(id, updateIntervenantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un intervenant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'intervenant' })
  @ApiResponse({ status: 200, description: 'Intervenant supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Intervenant non trouvé.' })
  async remove(@Param('id') id: string): Promise<Intervenant> {
    return this.intervenantsService.delete(id);
  }
}
