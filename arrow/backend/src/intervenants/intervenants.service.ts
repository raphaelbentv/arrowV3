import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Intervenant, IntervenantDocument } from "./intervenants.schema";
import { CreateIntervenantDto } from "./dtos/create-intervenant.dto";
import { UpdateIntervenantDto } from "./dtos/update-intervenant.dto";
import { request } from "express";

@Injectable()
export class IntervenantsService {
  constructor(
    @InjectModel(Intervenant.name)
    private intervenantModel: Model<IntervenantDocument>,
  ) {}

  async getAll(): Promise<Intervenant[]> {
    // Check for token here
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    // Verify token validity (e.g., check expiration, decode, etc.)
    // If token is invalid or expired, throw an error
    return this.intervenantModel.find().exec();
  }

  async findAll(): Promise<Intervenant[]> {
    return await this.intervenantModel.find().exec();
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
    try {
      console.log('Création de l\'intervenant avec les données:', createIntervenantDto);
      const createdIntervenant = new this.intervenantModel(createIntervenantDto);
      return await createdIntervenant.save();
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervenant:', error);
      throw error;
    }
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
