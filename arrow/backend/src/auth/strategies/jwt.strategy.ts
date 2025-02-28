/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AdminService } from '../../admin/admin.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'votre_secret_temporaire',
    });
  }

  async validate(payload: any) {
    // Vérifier d'abord si c'est un administrateur
    const admin = await this.adminService.findByEmail(payload.email);
    if (admin) {
      return {
        userId: admin._id,
        email: admin.email,
        isAdmin: true,
      };
    }

    // Sinon, vérifier si c'est un utilisateur normal
    const user = await this.usersService.findByEmail(payload.email);
    if (user) {
      return {
        userId: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
      };
    }

    return null;
  }
} 