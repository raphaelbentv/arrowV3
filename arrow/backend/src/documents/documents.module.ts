import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModel, DocumentSchema } from './documents.schema';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocumentModel.name, schema: DocumentSchema }]),
    MulterModule.register({}),
  ],
  controllers: [UploadsController, DocumentsController],
  exports: [MongooseModule],
})
export class DocumentsModule {}

