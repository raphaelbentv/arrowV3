import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Etudiant, EtudiantDocument } from './etudiants.schema';
import { CreateEtudiantDto } from './dtos/create-etudiant.dto';
import { UpdateEtudiantDto } from './dtos/update-etudiant.dto';

@Injectable()
export class EtudiantsService {
  constructor(
    @InjectModel(Etudiant.name)
    private etudiantModel: Model<EtudiantDocument>,
  ) {}

  async findAll(): Promise<EtudiantDocument[]> {
    return await this.etudiantModel
      .find()
      .populate('cohorteActuelle', 'nom anneeScolaire')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<EtudiantDocument> {
    const etudiant = await this.etudiantModel
      .findById(id)
      .populate('cohorteActuelle', 'nom anneeScolaire typeFormation')
      .populate('cohortesHistorique', 'nom anneeScolaire')
      .exec();

    if (!etudiant) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }

    return etudiant;
  }

  async create(createEtudiantDto: CreateEtudiantDto): Promise<EtudiantDocument> {
    try {
      const createdEtudiant = new this.etudiantModel(createEtudiantDto);
      return await createdEtudiant.save();
    } catch (error) {
      console.error('Erreur lors de la création de l\'étudiant:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateEtudiantDto: UpdateEtudiantDto,
  ): Promise<EtudiantDocument> {
    const updatedEtudiant = await this.etudiantModel
      .findByIdAndUpdate(id, updateEtudiantDto, { new: true })
      .exec();

    if (!updatedEtudiant) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }

    return updatedEtudiant;
  }

  async delete(id: string): Promise<EtudiantDocument> {
    const deletedEtudiant = await this.etudiantModel.findByIdAndDelete(id).exec();

    if (!deletedEtudiant) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }

    return deletedEtudiant;
  }

  async findByCohorte(cohorteId: string): Promise<EtudiantDocument[]> {
    return await this.etudiantModel
      .find({ cohorteActuelle: cohorteId })
      .sort({ nom: 1, prenom: 1 })
      .exec();
  }

  async getStats() {
    const total = await this.etudiantModel.countDocuments().exec();
    const inscrits = await this.etudiantModel.countDocuments({ statutInscription: 'Inscrit' }).exec();
    const admis = await this.etudiantModel.countDocuments({ statutInscription: 'Admis' }).exec();
    const diplomes = await this.etudiantModel.countDocuments({ statutInscription: 'Diplômé' }).exec();

    return {
      total,
      inscrits,
      admis,
      diplomes,
    };
  }
}
