import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class DevAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // En mode développement, on désactive l'authentification
    // et on simule un utilisateur admin
    const request = context.switchToHttp().getRequest();
    
    // Simuler un utilisateur admin pour le développement
    request.user = {
      userId: 'dev-admin-id',
      email: 'admin@dev.com',
      role: 'admin',
      isAdmin: true,
    };
    
    return true;
  }
}
