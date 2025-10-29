// Script pour créer un administrateur initial
// À exécuter dans la console du navigateur ou comme script de test

const createInitialAdmin = async () => {
  const adminData = {
    email: 'admin@arrow.com',
    nom: 'Admin',
    prenom: 'Principal',
    password: 'admin123'
  };

  try {
    console.log('🔧 Création d\'un administrateur initial...');
    
    const response = await fetch('http://localhost:4000/api/v1/admin/initial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Administrateur créé avec succès:', result);
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Mot de passe:', adminData.password);
    } else {
      const error = await response.text();
      console.error('❌ Erreur lors de la création:', error);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
};

// Exécuter le script
createInitialAdmin();
