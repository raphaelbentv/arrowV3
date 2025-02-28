import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IntervenantsModule } from './intervenants/intervenants.module';
import { AdminModule } from './admin/admin.module';
// Importez vos autres modules ici

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/arrow'),
    AuthModule,
    UsersModule,
    IntervenantsModule,
    AdminModule,
    // Ajoutez vos autres modules ici
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}