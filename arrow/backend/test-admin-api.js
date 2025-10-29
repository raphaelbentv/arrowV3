const axios = require('axios');

const API_URL = 'http://localhost:4000/api/v1';

async function testAdminAPI() {
  try {
    console.log('🧪 Test de l\'API Admin...');
    
    // Test 1: Créer un admin via l'endpoint initial
    console.log('\n1️⃣ Test de création d\'admin via /admin/initial');
    const adminData = {
      email: 'test-api@example.com',
      nom: 'TestAPI',
      prenom: 'AdminAPI',
      password: 'password123'
    };
    
    try {
      const createResponse = await axios.post(`${API_URL}/admin/initial`, adminData);
      console.log('✅ Admin créé via API:', createResponse.data);
    } catch (error) {
      console.log('❌ Erreur création API:', error.response?.data || error.message);
    }
    
    // Test 2: Lister les admins via l'endpoint GET
    console.log('\n2️⃣ Test de listing des admins via /admin');
    try {
      const listResponse = await axios.get(`${API_URL}/admin`);
      console.log('✅ Liste des admins:', listResponse.data);
    } catch (error) {
      console.log('❌ Erreur listing API:', error.response?.data || error.message);
    }
    
    // Test 3: Vérifier directement en base
    console.log('\n3️⃣ Vérification directe en base de données');
    const mongoose = require('mongoose');
    
    const adminSchema = new mongoose.Schema({
      email: String,
      password: String,
      nom: String,
      prenom: String,
      isAdmin: Boolean,
      permissions: [String]
    }, { timestamps: true });
    
    const Admin = mongoose.model('Admin', adminSchema);
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';
    await mongoose.connect(MONGODB_URI);
    
    const admins = await Admin.find();
    console.log(`📊 Admins en base: ${admins.length}`);
    admins.forEach(admin => {
      console.log(`  - ${admin.prenom} ${admin.nom} (${admin.email})`);
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testAdminAPI();
