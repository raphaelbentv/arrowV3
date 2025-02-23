/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { IntervenantsService } from '../intervenants/intervenants.service';
import { Intervenant, IntervenantSchema } from '../intervenants/intervenants.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIntervenantDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  poste: string;

  @IsString()
  @IsNotEmpty()
  statut: string;

  @IsString()
  @IsNotEmpty()
  typeContrat: string;
}

describe('IntervenantsService', () => {
  let service: IntervenantsService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    // Vérifier si une connexion existe déjà
    if (mongoose.connection.readyState === mongoose.STATES.connected) {
      await mongoose.disconnect();
    }
    
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
  
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Intervenant.name, schema: IntervenantSchema }]),
      ],
      providers: [IntervenantsService],
    }).compile();
  
    service = module.get<IntervenantsService>(IntervenantsService);
    
    try {
      await mongoose.connect(uri);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Erreur de connexion MongoDB:', error);
    }
  });

  // Attendre que la déconnexion soit complète
  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await mongoose.disconnect();
    await mongod.stop();
  });

  const testData = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '0601020304',
    poste: 'Développeur',
    statut: 'Actif',
    typeContrat: 'CDI',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to MongoDB', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should create an intervenant', async () => {
    const newIntervenant = await service.create(testData);
    expect(newIntervenant).toHaveProperty('_id');
    expect(newIntervenant.nom).toBe('Dupont');
  });

  it('should find an intervenant by ID', async () => {
    const created = await service.create({
      ...testData,
      nom: 'Martin',
      email: 'martin@example.com'
    });
    const found = await service.findOne(created._id.toString());
    expect(found).toBeDefined();
    expect(found.nom).toBe('Martin');
  });

  it('should update an intervenant', async () => {
    const created = await service.create({
      ...testData,
      nom: 'Laurent',
      email: 'laurent@example.com'
    });

    const updated = await service.update(created._id.toString(), {
      telephone: '0787654321',
    });

    expect(updated.telephone).toBe('0787654321');
  });

  it('should delete an intervenant', async () => {
    const created = await service.create({
      ...testData,
      nom: 'Robert',
      email: 'robert@example.com'
    });

    await service.delete(created._id.toString());
    
    try {
      await service.findOne(created._id.toString());
      fail('Should have thrown NotFoundException');
    } catch (error) {
      expect(error.message).toContain('not found');
    }
  });
});