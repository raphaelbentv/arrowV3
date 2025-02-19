import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { IntervenantsService } from './intervenants.service';
import { CreateIntervenantDto } from './dto/create-intervenant.dto';
import { UpdateIntervenantDto } from './dto/update-intervenant.dto';
import { JwtAuthGuard } from '../auth/gards/jwt-auth.guard';
import { Intervenant } from './intervenants.schema';

@Controller('intervenants')
@UseGuards(JwtAuthGuard)
export class IntervenantsController {
  constructor(private readonly intervenantsService: IntervenantsService) {}

  /**
   * 📌 Ajouter un nouvel intervenant
   */
  @Post()
  async create(@Body() createIntervenantDto: CreateIntervenantDto): Promise<Intervenant> {
    return this.intervenantsService.create(createIntervenantDto);
  }

  /**
   * 📌 Récupérer tous les intervenants
   */
  @Get()
  async findAll(): Promise<Intervenant[]> {
    return this.intervenantsService.findAll();
  }

  /**
   * 📌 Récupérer un intervenant par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Intervenant> {
    const intervenant = await this.intervenantsService.findOne(id);
    if (!intervenant) {
      throw new NotFoundException(`Intervenant avec l'ID ${id} introuvable.`);
    }
    return intervenant;
  }

  /**
   * 📌 Mettre à jour un intervenant
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIntervenantDto: UpdateIntervenantDto): Promise<Intervenant> {
    const updatedIntervenant = await this.intervenantsService.update(id, updateIntervenantDto);
    if (!updatedIntervenant) {
      throw new NotFoundException(`Impossible de mettre à jour : Intervenant avec l'ID ${id} introuvable.`);
    }
    return updatedIntervenant;
  }

  /**
   * 📌 Supprimer un intervenant
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.intervenantsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Suppression impossible : Intervenant avec l'ID ${id} introuvable.`);
    }
    return { message: `Intervenant avec l'ID ${id} supprimé.` };
  }
}