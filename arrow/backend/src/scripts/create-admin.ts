import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  const uri = 'mongodb+srv://raphaelbentv:UraRJervWInvUFJW@cluster0.d7cns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/arrow';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à la base de données');

    const database = client.db('arrow');
    const adminsCollection = database.collection('admins');

    // Vérifier si un admin existe déjà
    const existingAdmin = await adminsCollection.findOne({ email: 'bentv@me.com' });
    
    if (existingAdmin) {
      console.log('Un administrateur existe déjà avec cet email');
      return;
    }

    // Créer un nouvel administrateur
    const hashedPassword = await bcrypt.hash('losange', 10);
    
    const admin = {
      email: 'bentv@me.com',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'User',
      isAdmin: true,
      permissions: ['all'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await adminsCollection.insertOne(admin);
    console.log('Administrateur créé avec l\'ID:', result.insertedId);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await client.close();
    console.log('Connexion à la base de données fermée');
  }
}

createAdmin().catch(console.error); 