import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à la base de données');

    const database = client.db('arrow'); // Ajustez selon votre configuration
    const usersCollection = database.collection('users');

    // Vérifier si un admin existe déjà
    const existingAdmin = await usersCollection.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Un administrateur existe déjà avec cet email');
      return;
    }

    // Créer un nouvel administrateur
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await usersCollection.insertOne(admin);
    console.log('Administrateur créé avec l\'ID:', result.insertedId);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await client.close();
    console.log('Connexion à la base de données fermée');
  }
}

createAdmin().catch(console.error); 