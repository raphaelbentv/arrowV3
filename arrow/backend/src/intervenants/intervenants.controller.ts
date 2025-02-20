/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { IntervenantsService } from './intervenants.service';
import { CreateIntervenantDto } from './dto/create-intervenant.dto';
import { UpdateIntervenantDto } from './dto/update-intervenant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Intervenant } from './intervenants.schema';

@ApiTags('intervenants')
@Controller('intervenants')
export class IntervenantsController {
  constructor(private readonly intervenantsService: IntervenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel intervenant' })
  @ApiBody({ type: CreateIntervenantDto })
  @ApiResponse({ status: 201, description: 'Intervenant créé avec succès.', type: Intervenant })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  async create(@Body() createIntervenantDto: CreateIntervenantDto): Promise<Intervenant> {
    return this.intervenantsService.create(createIntervenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les intervenants' })
  @ApiResponse({ status: 200, description: 'Liste des intervenants récupérée avec succès.', type: [Intervenant] })
  async findAll(): Promise<Intervenant[]> {
    return this.intervenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un intervenant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'intervenant' })
  @ApiResponse({ status: 200, description: 'Intervenant récupéré avec succès.', type: Intervenant })
  @ApiResponse({ status: 404, description: 'Intervenant non trouvé.' })
  async findOne(@Param('id') id: string): Promise<Intervenant> {
    return this.intervenantsService.findOne(id);
  }

  @Patch(':id')
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
  @ApiOperation({ summary: 'Supprimer un intervenant par ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID de l\'intervenant' })
  @ApiResponse({ status: 200, description: 'Intervenant supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Intervenant non trouvé.' })
  async remove(@Param('id') id: string): Promise<Intervenant> {
    return this.intervenantsService.delete(id);
  }
}
