import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EtudiantsService } from './etudiants.service';
import { EtudiantsController } from './etudiants.controller';
import { Etudiant, EtudiantSchema } from './etudiants.schema';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Etudiant.name, schema: EtudiantSchema }]),
    DocumentsModule,
  ],
  controllers: [EtudiantsController],
  providers: [EtudiantsService],
  exports: [EtudiantsService],
})
export class EtudiantsModule {}
