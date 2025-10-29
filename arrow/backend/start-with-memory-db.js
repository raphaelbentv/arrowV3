// Script pour démarrer le backend avec une base de données en mémoire
// À exécuter dans le terminal

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function startBackendWithMemoryDB() {
  try {
    console.log('🚀 Démarrage du serveur MongoDB en mémoire...');
    
    // Démarrer MongoDB en mémoire
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('📊 URI MongoDB:', uri);
    
    // Connecter Mongoose
    await mongoose.connect(uri);
    console.log('✅ Connecté à MongoDB en mémoire');
    
    // Démarrer le serveur NestJS
    console.log('🌐 Démarrage du serveur NestJS...');
    const { exec } = require('child_process');
    
    exec('npm run start:dev', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erreur lors du démarrage:', error);
        return;
      }
      console.log('📤 Sortie:', stdout);
      if (stderr) console.error('⚠️ Erreurs:', stderr);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

startBackendWithMemoryDB();
