import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Intervenant, IntervenantDocument } from "./intervenants.schema";
import { CreateIntervenantDto } from "./dto/create-intervenant.dto";
import { UpdateIntervenantDto } from "./dto/update-intervenant.dto";

@Injectable()
export class IntervenantsService {
  constructor(
    @InjectModel(Intervenant.name)
    private intervenantModel: Model<IntervenantDocument>,
  ) {}

  async findAll(): Promise<Intervenant[]> {
    return this.intervenantModel.find().exec();
  }

  async findOne(id: string): Promise<Intervenant> {
    const intervenant = await this.intervenantModel.findById(id).exec();
    if (!intervenant) {
      throw new Error("Intervenant not found");
    }
    return intervenant;
  }

  async create(
    createIntervenantDto: CreateIntervenantDto,
  ): Promise<Intervenant> {
    const newIntervenant = new this.intervenantModel(createIntervenantDto);
    return newIntervenant.save();
  }

  async update(
    id: string,
    updateIntervenantDto: UpdateIntervenantDto,
  ): Promise<Intervenant> {
    const updatedIntervenant = await this.intervenantModel
      .findByIdAndUpdate(id, updateIntervenantDto, { new: true })
      .exec();
    if (!updatedIntervenant) {
      throw new Error("Intervenant not found");
    }
    return updatedIntervenant;
  }

  async delete(id: string): Promise<Intervenant> {
    const deletedIntervenant = await this.intervenantModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedIntervenant) {
      throw new Error("Intervenant not found");
    }
    return deletedIntervenant;
  }
}
