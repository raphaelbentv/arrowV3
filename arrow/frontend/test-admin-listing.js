// Script à exécuter dans la console du navigateur sur la page AdministratorList
// pour tester le listing des admins directement depuis la base de données

const testAdminListing = async () => {
  try {
    console.log('🧪 Test du listing des admins...');
    
    // Simuler les données d'admin depuis la base
    const mockAdmins = [
      {
        _id: '6900d74cb876b4f7a1e40bb8',
        email: 'admin@test.com',
        nom: 'Test',
        prenom: 'Admin',
        createdAt: '2025-10-28T14:46:36.698Z'
      }
    ];
    
    console.log('📊 Admins simulés:', mockAdmins);
    
    // Tester l'affichage dans l'interface
    const adminListElement = document.querySelector('table tbody');
    if (adminListElement) {
      console.log('✅ Tableau trouvé, nombre de lignes:', adminListElement.children.length);
      
      // Ajouter une ligne de test
      const testRow = document.createElement('tr');
      testRow.innerHTML = `
        <td style="padding: 1.5rem; color: #87ceeb;">Admin Test</td>
        <td style="padding: 1.5rem; color: #87ceeb;">admin@test.com</td>
        <td style="padding: 1.5rem; text-align: center;">
          <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/></svg></button>
        </td>
      `;
      adminListElement.appendChild(testRow);
      console.log('✅ Ligne de test ajoutée au tableau');
    } else {
      console.log('❌ Tableau non trouvé');
    }
    
    // Tester la création d'un nouvel admin
    console.log('\n🧪 Test de création d\'admin...');
    const addButton = document.querySelector('button[onclick*="handleOpenEditDialog"]');
    if (addButton) {
      console.log('✅ Bouton "Ajouter un admin" trouvé');
      addButton.click();
      console.log('✅ Modal d\'ajout ouverte');
      
      // Attendre un peu puis fermer
      setTimeout(() => {
        const cancelButton = document.querySelector('button[onclick*="handleCloseEditDialog"]');
        if (cancelButton) {
          cancelButton.click();
          console.log('✅ Modal fermée');
        }
      }, 2000);
    } else {
      console.log('❌ Bouton "Ajouter un admin" non trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

// Exécuter le test
testAdminListing();
