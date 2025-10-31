import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CohortesModule } from './cohortes/cohortes.module';
import { IntervenantsModule } from './intervenants/intervenants.module';
import { EtudiantsModule } from './etudiants/etudiants.module';
import { DocumentsModule } from './documents/documents.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ModulesModule } from './modules/modules.module';
import { SchoolModule } from './school/school.module';
// Importez vos autres modules ici

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
      dbName: 'arrow',
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    CohortesModule,
    IntervenantsModule,
    EtudiantsModule,
    DocumentsModule,
    AttendanceModule,
    ModulesModule,
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}