import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

export interface Administrator {
  _id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  statut: boolean;
}

class AdministratorsService {
  async getAll(): Promise<Administrator[]> {
    console.log('🔍 Service: Début de getAll');
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token trouvé:', token ? 'Oui' : 'Non');
      
      if (!token) {
        console.error('❌ Service: Pas de token trouvé');
        throw new Error('Non authentifié');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const url = `${API_URL}/intervenants`;
      console.log('📡 Envoi de la requête à:', url);
      
      const response = await axios.get(url, config);
      
      console.log('✅ Réponse reçue:', {
        status: response.status,
        nombreDonnées: response.data?.length || 0,
        premierÉlément: response.data?.[0]
      });
      
      return response.data;

    } catch (error: any) {
      console.error('❌ Service: Erreur dans getAll:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      throw error;
    }
  }

  async create(admin: Omit<Administrator, '_id'>): Promise<Administrator> {
    console.log('📝 Tentative de création d\'un administrateur:', admin);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(`${API_URL}/administrators`, admin, config);
      console.log('✅ Administrateur créé avec succès:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erreur lors de la création de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création');
    }
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ Tentative de suppression de l\'administrateur:', id);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.delete(`${API_URL}/administrators/${id}`, config);
      console.log('✅ Administrateur supprimé avec succès');

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
}

export const administratorsService = new AdministratorsService(); 