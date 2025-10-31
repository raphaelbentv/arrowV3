import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
    try {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
      
      // Création de l'administrateur avec le mot de passe haché
      const newAdmin = new this.adminModel({
        ...createAdminDto,
        password: hashedPassword,
        isAdmin: true,
      });
      
      return await newAdmin.save();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de l'administrateur: ${errorMessage}`);
    }
  }

  async findAll(): Promise<AdminDocument[]> {
    return this.adminModel.find().exec();
  }

  async findById(id: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException(`Administrateur avec ID ${id} non trouvé`);
    }
    return admin;
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: Partial<Admin>): Promise<AdminDocument> {
    // Ne pas mettre à jour le mot de passe ici (utiliser changePassword)
    const { password, ...updateWithoutPassword } = updateData;
    
    // Ajouter la date de dernière modification
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(
        id,
        { ...updateWithoutPassword, derniereModificationProfil: new Date() },
        { new: true }
      )
      .exec();
      
    if (!updatedAdmin) {
      throw new NotFoundException(`Administrateur avec ID ${id} non trouvé`);
    }
    
    return updatedAdmin;
  }

  async remove(id: string): Promise<AdminDocument> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id).exec();
    if (!deletedAdmin) {
      throw new NotFoundException(`Administrateur avec ID ${id} non trouvé`);
    }
    return deletedAdmin;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<AdminDocument> {
    const admin = await this.findById(id);
    
    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Mot de passe actuel incorrect');
    }
    
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour le mot de passe
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
      
    if (!updatedAdmin) {
      throw new NotFoundException(`Administrateur avec ID ${id} non trouvé`);
    }
    
    return updatedAdmin;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, { derniereConnexion: new Date() }).exec();
  }

  async updateLastProfileModification(id: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, { derniereModificationProfil: new Date() }).exec();
  }
}