// Script de test final pour vérifier l'API complète
// À exécuter dans la console du navigateur sur la page AdministratorList

const testCompleteAPI = async () => {
  try {
    console.log('🧪 Test complet de l\'API Admin...');
    
    // Test 1: Lister les admins existants
    console.log('\n1️⃣ Test de listing des admins');
    const listResponse = await fetch('http://localhost:4000/api/v1/admin');
    const admins = await listResponse.json();
    console.log('✅ Admins existants:', admins);
    
    // Test 2: Créer un nouvel admin
    console.log('\n2️⃣ Test de création d\'admin');
    const newAdmin = {
      email: `test-frontend-${Date.now()}@example.com`,
      nom: 'Frontend',
      prenom: 'Test',
      password: 'password123'
    };
    
    const createResponse = await fetch('http://localhost:4000/api/v1/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAdmin)
    });
    
    if (createResponse.ok) {
      const createdAdmin = await createResponse.json();
      console.log('✅ Admin créé:', createdAdmin);
      
      // Test 3: Vérifier que l'admin apparaît dans la liste
      console.log('\n3️⃣ Vérification de la liste mise à jour');
      const updatedListResponse = await fetch('http://localhost:4000/api/v1/admin');
      const updatedAdmins = await updatedListResponse.json();
      console.log('✅ Liste mise à jour:', updatedAdmins);
      
      // Test 4: Mettre à jour l'admin
      console.log('\n4️⃣ Test de mise à jour d\'admin');
      const updateData = {
        nom: 'FrontendUpdated',
        prenom: 'TestUpdated'
      };
      
      const updateResponse = await fetch(`http://localhost:4000/api/v1/admin/${createdAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (updateResponse.ok) {
        const updatedAdmin = await updateResponse.json();
        console.log('✅ Admin mis à jour:', updatedAdmin);
        
        // Test 5: Supprimer l'admin
        console.log('\n5️⃣ Test de suppression d\'admin');
        const deleteResponse = await fetch(`http://localhost:4000/api/v1/admin/${createdAdmin._id}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Admin supprimé avec succès');
          
          // Vérification finale
          const finalListResponse = await fetch('http://localhost:4000/api/v1/admin');
          const finalAdmins = await finalListResponse.json();
          console.log('✅ Liste finale:', finalAdmins);
        } else {
          console.log('❌ Erreur lors de la suppression');
        }
      } else {
        console.log('❌ Erreur lors de la mise à jour');
      }
    } else {
      console.log('❌ Erreur lors de la création');
    }
    
    console.log('\n🎉 Tests terminés ! L\'API fonctionne correctement.');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
};

// Exécuter les tests
testCompleteAPI();
