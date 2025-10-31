import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModuleCours, ModuleCoursDocument } from './modules.schema';
import { CreateModuleDto } from './dtos/create-module.dto';
import { UpdateModuleDto } from './dtos/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(ModuleCours.name)
    private moduleModel: Model<ModuleCoursDocument>,
  ) {}

  async create(dto: CreateModuleDto): Promise<ModuleCours> {
    const created = new this.moduleModel(dto);
    return await created.save();
  }

  async findAll(): Promise<ModuleCours[]> {
    return await this.moduleModel.find().exec();
  }

  async findOne(id: string): Promise<ModuleCours> {
    const found = await this.moduleModel.findById(id).exec();
    if (!found) {
      throw new Error('Module non trouvé');
    }
    return found;
  }

  async update(id: string, dto: UpdateModuleDto): Promise<ModuleCours> {
    const updated = await this.moduleModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new Error('Module non trouvé');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new Error('Module non trouvé');
    }
  }
}

