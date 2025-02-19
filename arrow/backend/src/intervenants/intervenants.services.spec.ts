import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { IntervenantsService } from './intervenants.service';
import { Intervenant, IntervenantSchema } from './intervenants.schema';
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
}

describe('IntervenantsService', () => {
  let service: IntervenantsService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
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
    
    // Attendre la connexion MongoDB avant de lancer les tests
    await mongoose.connect(uri);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Attente explicite
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to MongoDB', async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it('should create an intervenant', async () => {
    const newIntervenant = await service.create({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        telephone: '0601020304',
        poste: '',
        statut: '',
        typeContrat: ''
    });

    expect(newIntervenant).toHaveProperty('_id');
    expect(newIntervenant.nom).toBe('Dupont');
    expect(newIntervenant.email).toBe('jean.dupont@example.com');
  });

  it('should find an intervenant by ID', async () => {
    const created = await service.create({
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@example.com',
        telephone: '0612345678',
        poste: '',
        statut: '',
        typeContrat: ''
    });

    const found = await service.findOne(created._id.toString());
    expect(found).toBeDefined();
    expect(found.nom).toBe('Martin');
  });

  it('should update an intervenant', async () => {
    const created = await service.create({
        nom: 'Laurent',
        prenom: 'Claire',
        email: 'claire.laurent@example.com',
        telephone: '0701234567',
        poste: '',
        statut: '',
        typeContrat: ''
    });

    const updated = await service.update(created._id.toString(), {
      telephone: '0787654321',
    });

    expect(updated.telephone).toBe('0787654321');
  });

  it('should delete an intervenant', async () => {
    const created = await service.create({
        nom: 'Robert',
        prenom: 'Alice',
        email: 'alice.robert@example.com',
        telephone: '0755555555',
        poste: '',
        statut: '',
        typeContrat: ''
    });

    await service.delete(created._id.toString());
    const deleted = await service.findOne(created._id.toString());

    expect(deleted).toBeNull();
  });
});