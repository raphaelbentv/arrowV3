/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as unknown as RequestUser;

    if (!user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException('Accès réservé aux administrateurs');
    }

    return true;
  }
}