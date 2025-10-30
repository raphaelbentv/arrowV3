import { Controller, Post, Param, UseInterceptors, UploadedFiles, BadRequestException, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentModel, TypeDocument, TypeEntite } from './documents.schema';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function storageFactory(subFolderBuilder: (params: { sessionId: string }) => string) {
  return diskStorage({
    destination: (req, _file, cb) => {
      const sessionId = req.params.id as string;
      if (!sessionId) {
        return cb(new BadRequestException('Session id manquant') as any, '');
      }
      const dest = join(process.cwd(), 'arrow', 'backend', 'uploads', subFolderBuilder({ sessionId }));
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  });
}

@Controller('uploads')
export class UploadsController {
  constructor(
    @InjectModel(DocumentModel.name) private readonly docModel: Model<DocumentModel>,
  ) {}

  @Post('sessions/:id/emargements')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: storageFactory(({ sessionId }) => join('sessions', sessionId, 'emargements')),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async uploadEmargements(
    @Param('id') sessionId: string,
    @UploadedFiles() files: MulterFile[],
    @Body('uploadedBy') uploadedBy?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier');
    }

    const docs = await this.docModel.insertMany(
      files.map((f) => ({
        nomFichier: f.originalname,
        cheminStockage: f.path,
        typeDocument: TypeDocument.EMARGEMENT,
        typeEntite: TypeEntite.SESSION,
        entiteId: new Types.ObjectId(sessionId),
        mimeType: f.mimetype,
        taille: f.size,
        uploadPar: uploadedBy ? new Types.ObjectId(uploadedBy) : undefined,
        actif: true,
      })),
    );

    return { count: docs.length, documents: docs };
  }

  @Post('sessions/:id/justificatifs')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: storageFactory(({ sessionId }) => join('sessions', sessionId, 'justificatifs')),
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  async uploadJustificatifs(
    @Param('id') sessionId: string,
    @UploadedFiles() files: MulterFile[],
    @Body('etudiantId') etudiantId?: string,
    @Body('uploadedBy') uploadedBy?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier');
    }

    const docs = await this.docModel.insertMany(
      files.map((f) => ({
        nomFichier: f.originalname,
        cheminStockage: f.path,
        typeDocument: TypeDocument.JUSTIFICATIF_ABSENCE,
        typeEntite: TypeEntite.SESSION,
        entiteId: new Types.ObjectId(sessionId),
        mimeType: f.mimetype,
        taille: f.size,
        uploadPar: uploadedBy ? new Types.ObjectId(uploadedBy) : undefined,
        actif: true,
        // vous pouvez aussi stocker etudiantId dans un champ description pour liaison souple
        description: etudiantId ? `justificatif pour etudiant ${etudiantId}` : undefined,
      })),
    );

    return { count: docs.length, documents: docs };
  }
}


