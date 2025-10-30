import { Controller, Get, Param, Res, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentModel } from './documents.schema';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';

@Controller('documents')
@UseGuards(DevAuthGuard)
export class DocumentsController {
  constructor(
    @InjectModel(DocumentModel.name) private readonly docModel: Model<DocumentModel>,
  ) {}

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.docModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Document introuvable');
    const path = (doc as any).cheminStockage as string;
    if (!path || !existsSync(path)) throw new NotFoundException('Fichier non trouvé');

    res.setHeader('Content-Type', (doc as any).mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${(doc as any).nomFichier || 'document'}"`);
    const stream = createReadStream(path);
    stream.pipe(res);
  }
}


