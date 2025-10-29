// Script de test pour vérifier l'endpoint de création d'admin
// À exécuter dans la console du navigateur sur la page AdministratorList

const testCreateAdmin = async () => {
  const adminData = {
    email: 'test@example.com',
    nom: 'Test',
    prenom: 'User',
    password: 'password123'
  };

  try {
    console.log('🧪 Test de création d\'administrateur...');
    console.log('📤 Données envoyées:', adminData);
    
    const response = await fetch('http://localhost:4000/api/v1/admin/initial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    console.log('📡 Statut de la réponse:', response.status);
    console.log('📡 Headers:', response.headers);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Administrateur créé avec succès:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Erreur lors de la création:', errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    throw error;
  }
};

// Exécuter le test
testCreateAdmin()
  .then(result => {
    console.log('🎉 Test réussi!', result);
    // Recharger la page pour voir le nouvel admin
    window.location.reload();
  })
  .catch(error => {
    console.error('💥 Test échoué:', error);
  });
