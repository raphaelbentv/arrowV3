/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dtos/create-module.dto';
import { UpdateModuleDto } from './dtos/update-module.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ModuleCours } from './modules.schema';

@ApiTags('modules')
@ApiBearerAuth()
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un module' })
  @ApiBody({ type: CreateModuleDto })
  @ApiResponse({ status: 201, description: 'Module créé', type: ModuleCours })
  async create(@Body() dto: CreateModuleDto): Promise<ModuleCours> {
    return await this.modulesService.create(dto);
  }

  @Get()
  @UseGuards(DevAuthGuard)
  @ApiOperation({ summary: 'Lister les modules' })
  @ApiResponse({ status: 200, description: 'OK', type: [ModuleCours] })
  async findAll(): Promise<ModuleCours[]> {
    return await this.modulesService.findAll();
  }

  @Get(':id')
  @UseGuards(DevAuthGuard)
  @ApiOperation({ summary: 'Récupérer un module par ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'OK', type: ModuleCours })
  async findOne(@Param('id') id: string): Promise<ModuleCours> {
    return await this.modulesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Mettre à jour un module' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateModuleDto })
  @ApiResponse({ status: 200, description: 'OK', type: ModuleCours })
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto): Promise<ModuleCours> {
    return await this.modulesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un module' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Supprimé' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.modulesService.delete(id);
  }
}

