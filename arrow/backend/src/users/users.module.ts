/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
    try {
      console.log('UsersModule initialized');
    } catch (error) {
      // Gestion sécurisée de l'erreur
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`Erreur lors de l'initialisation du module utilisateurs: ${errorMessage}`);
    }
  }
} 