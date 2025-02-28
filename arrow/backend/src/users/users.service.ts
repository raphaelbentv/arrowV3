 
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Création de l'utilisateur avec le mot de passe haché
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      
      return await newUser.save();
    } catch (error) {
      // Gestion sécurisée de l'erreur
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la création de l\'utilisateur';
      throw new Error(`Erreur lors de la création de l'utilisateur: ${errorMessage}`);
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    
    return updatedUser;
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return deletedUser;
  }
} 