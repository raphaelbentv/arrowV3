const mongoose = require('mongoose');

async function checkAdminsInDB() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier les admins existants
    const admins = await mongoose.connection.db.collection('admins').find({}).toArray();
    console.log(`📊 Admins trouvés: ${admins.length}`);
    
    if (admins.length > 0) {
      console.log('👥 Détails des admins:');
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.prenom} ${admin.nom} (${admin.email})`);
        console.log(`     ID: ${admin._id}`);
        console.log(`     Créé: ${admin.createdAt}`);
        console.log(`     Admin: ${admin.isAdmin}`);
        console.log('');
      });
    } else {
      console.log('ℹ️  Aucun admin trouvé en base');
    }

    // Vérifier les collections disponibles
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections disponibles:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

checkAdminsInDB();
