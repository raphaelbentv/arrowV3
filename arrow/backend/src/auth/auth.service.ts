/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

interface UserResponse {
  id: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ user: UserResponse; token: string }> {
    const payload: JwtPayload = { 
      email: user.email, 
      sub: user._id,
      role: user.role 
    };
    
    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(userId: string): Promise<Omit<UserDocument, 'password'>> {
    try {
      const user = await this.usersService.findById(userId);
      const { password, ...result } = user.toObject();
      return result;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
  }

  async createInitialAdmin(): Promise<any> {
    // Vérifier si un admin existe déjà
    const existingAdmin = await this.usersService.findByEmail('admin@example.com');
    
    if (existingAdmin) {
      return { message: 'Un administrateur existe déjà' };
    }
    
    // Créer un nouvel administrateur
    const admin = await this.usersService.create({
      email: 'admin@example.com',
      password: 'admin123', // Sera hashé par le service
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    return { 
      message: 'Administrateur créé avec succès',
      adminId: admin._id
    };
  }
}
