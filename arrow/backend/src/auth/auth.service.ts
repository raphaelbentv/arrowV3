/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { AdminService } from '../admin/admin.service';

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
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valide les identifiants d'un utilisateur (admin uniquement pour le MVP)
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Vérifier d'abord si c'est un administrateur
    const admin = await this.adminService.findByEmail(email);
    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin.toObject();
      return { ...result, isAdmin: true };
    }

    // Pour le MVP, nous ne permettons pas la connexion des utilisateurs non-admin
    return null;
  }

  /**
   * Génère un token JWT pour l'utilisateur authentifié
   */
  login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    
    // Pour le MVP, vérifier explicitement que l'utilisateur est un administrateur
    if (!user.isAdmin) {
      throw new UnauthorizedException('Accès réservé aux administrateurs');
    }

    const payload = { 
      email: user.email, 
      sub: user._id,
      isAdmin: user.isAdmin 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        nom: user.nom || user.firstName,
        prenom: user.prenom || user.lastName,
      },
    };
  }

  /**
   * Récupère le profil d'un utilisateur
   */
  async getProfile(userId: string): Promise<Omit<UserDocument, 'password'>> {
    try {
      // Vérifier d'abord si c'est un administrateur
      try {
        const admin = await this.adminService.findById(userId);
        if (admin) {
          const { password, ...result } = admin.toObject();
          return { ...result, isAdmin: true };
        }
      } catch (error) {
        // Si ce n'est pas un admin, on continue avec la recherche d'utilisateur standard
        console.log('Utilisateur non trouvé dans la base admin, recherche dans la base utilisateurs');
      }

      // Sinon, chercher parmi les utilisateurs standards
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      
      const { password, ...result } = user.toObject();
      return result;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
  }
}
