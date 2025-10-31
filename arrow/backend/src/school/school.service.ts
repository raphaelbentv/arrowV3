import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  // Créer ou récupérer la configuration de l'école (une seule instance)
  async createOrUpdate(dto: CreateSchoolDto | UpdateSchoolDto): Promise<SchoolDocument> {
    const existing = await this.schoolModel.findOne().exec();
    
    if (existing) {
      // Mettre à jour l'instance existante
      Object.assign(existing, dto);
      return await existing.save();
    } else {
      // Créer une nouvelle instance
      const school = new this.schoolModel(dto);
      return await school.save();
    }
  }

  // Récupérer la configuration de l'école
  async findOne(): Promise<SchoolDocument | null> {
    return await this.schoolModel.findOne().exec();
  }

  // Mettre à jour la configuration de l'école
  async update(dto: UpdateSchoolDto): Promise<SchoolDocument> {
    const school = await this.schoolModel.findOne().exec();

    if (!school) {
      // Si aucune instance n'existe, créer une nouvelle
      return await this.createOrUpdate(dto as CreateSchoolDto);
    }

    Object.assign(school, dto);
    return await school.save();
  }

  // Supprimer la configuration de l'école (pour reset)
  async delete(): Promise<void> {
    const result = await this.schoolModel.deleteMany({}).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Aucune configuration d\'école trouvée');
    }
  }
}

