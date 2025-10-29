const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma Admin (copié du backend)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  permissions: { type: [String], default: [] }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function addAdminDirectly() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    
    // Utiliser la même URI que le backend
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier s'il y a déjà des admins
    const existingAdmins = await Admin.find();
    console.log(`📊 Admins existants: ${existingAdmins.length}`);
    
    if (existingAdmins.length > 0) {
      console.log('👥 Admins trouvés:');
      existingAdmins.forEach(admin => {
        console.log(`  - ${admin.prenom} ${admin.nom} (${admin.email})`);
      });
    }

    // Créer un nouvel admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newAdmin = new Admin({
      email: 'admin@test.com',
      password: hashedPassword,
      nom: 'Test',
      prenom: 'Admin',
      isAdmin: true,
      permissions: ['read', 'write', 'delete']
    });

    console.log('📝 Création du nouvel admin...');
    const savedAdmin = await newAdmin.save();
    console.log('✅ Admin créé avec succès:', {
      id: savedAdmin._id,
      email: savedAdmin.email,
      nom: savedAdmin.nom,
      prenom: savedAdmin.prenom,
      createdAt: savedAdmin.createdAt
    });

    // Vérifier le listing final
    const allAdmins = await Admin.find();
    console.log(`\n📋 Listing final des admins (${allAdmins.length}):`);
    allAdmins.forEach(admin => {
      console.log(`  - ${admin.prenom} ${admin.nom} (${admin.email}) - ID: ${admin._id}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Un admin avec cet email existe déjà');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
addAdminDirectly();
