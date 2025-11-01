import { Controller, Get, Post, Body, Patch, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { School } from './school.schema';

@ApiTags('school')
@ApiBearerAuth()
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Récupérer la configuration de l\'école' })
  @ApiResponse({ status: 200, description: 'Configuration récupérée avec succès', type: School })
  async findOne() {
    return await this.schoolService.findOne();
  }

  @Post()
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer ou mettre à jour la configuration de l\'école' })
  @ApiResponse({ status: 201, description: 'Configuration créée/mise à jour avec succès', type: School })
  async createOrUpdate(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createOrUpdate(createSchoolDto);
  }

  @Patch()
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Mettre à jour la configuration de l\'école' })
  @ApiResponse({ status: 200, description: 'Configuration mise à jour avec succès', type: School })
  async update(@Body() updateSchoolDto: UpdateSchoolDto) {
    return await this.schoolService.update(updateSchoolDto);
  }

  @Delete()
  @UseGuards(DevAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer la configuration de l\'école' })
  @ApiResponse({ status: 204, description: 'Configuration supprimée avec succès' })
  async delete() {
    await this.schoolService.delete();
  }
}


