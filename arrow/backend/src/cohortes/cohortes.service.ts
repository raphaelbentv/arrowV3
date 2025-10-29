import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cohorte, CohorteDocument } from './cohortes.schema';
import { CreateCohorteDto } from './dto/create-cohorte.dto';
import { UpdateCohorteDto } from './dto/update-cohorte.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';

@Injectable()
export class CohortesService {
  constructor(
    @InjectModel(Cohorte.name) private cohorteModel: Model<CohorteDocument>,
  ) {}

  // Créer une cohorte
  async create(createCohorteDto: CreateCohorteDto): Promise<CohorteDocument> {
    const cohorte = new this.cohorteModel(createCohorteDto);
    return await cohorte.save();
  }

  // Liste toutes les cohortes
  async findAll(): Promise<CohorteDocument[]> {
    return await this.cohorteModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  // Trouver une cohorte par ID
  async findOne(id: string): Promise<CohorteDocument> {
    const cohorte = await this.cohorteModel
      .findById(id)
      .exec();

    if (!cohorte) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }

    return cohorte;
  }

  // Mettre à jour une cohorte
  async update(id: string, updateCohorteDto: UpdateCohorteDto): Promise<CohorteDocument> {
    const cohorte = await this.cohorteModel
      .findByIdAndUpdate(id, updateCohorteDto, { new: true })
      .exec();

    if (!cohorte) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }

    return cohorte;
  }

  // Supprimer une cohorte
  async remove(id: string): Promise<void> {
    const result = await this.cohorteModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }
  }

  // Assigner des étudiants à une cohorte
  async assignStudents(id: string, assignStudentsDto: AssignStudentsDto): Promise<CohorteDocument> {
    const cohorte = await this.cohorteModel.findById(id).exec();

    if (!cohorte) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }

    cohorte.etudiants = assignStudentsDto.etudiantIds as any;
    return await cohorte.save();
  }

  // Assigner un intervenant avec volume horaire
  async assignIntervenant(
    id: string,
    intervenantId: string,
    volumeHoraire?: number,
  ): Promise<CohorteDocument> {
    const cohorte = await this.cohorteModel.findById(id).exec();

    if (!cohorte) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }

    // Convertir en ObjectId et vérifier l'existence par comparaison de chaîne
    const intervenantObjectId = new Types.ObjectId(intervenantId);
    const exists = cohorte.intervenants.some(
      (i) => i.toString() === intervenantObjectId.toString(),
    );
    if (!exists) {
      // Cast pour contenter le typage Mongoose
      cohorte.intervenants.push(intervenantObjectId as any);
    }

    return await cohorte.save();
  }

  // Retirer un intervenant
  async removeIntervenant(id: string, intervenantId: string): Promise<CohorteDocument> {
    const cohorte = await this.cohorteModel.findById(id).exec();

    if (!cohorte) {
      throw new NotFoundException(`Cohorte avec l'ID ${id} non trouvée`);
    }

    cohorte.intervenants = cohorte.intervenants.filter(
      (i) => i.toString() !== intervenantId,
    ) as any;

    return await cohorte.save();
  }

  // Statistiques
  async getStats() {
    const total = await this.cohorteModel.countDocuments().exec();
    const actives = await this.cohorteModel.countDocuments({ actif: true }).exec();
    const inactives = total - actives;

    return {
      total,
      actives,
      inactives,
    };
  }
}