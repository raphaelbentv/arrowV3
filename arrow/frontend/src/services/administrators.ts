import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

export interface Administrator {
  _id: string;
  email: string;
  nom: string;
  prenom: string;
  photo?: string;
  telephoneMobile?: string;
  telephoneFixe?: string;
  posteFonction?: string;
  createdAt?: string;
  updatedAt?: string;
}

class AdministratorsService {
  async getAll(): Promise<Administrator[]> {
    console.log('🔍 Service: Début de getAll');
    
    try {
      // Mode développement : pas d'authentification
      const url = `${API_URL}/admin`;
      console.log('📡 Envoi de la requête à:', url);
      
      const response = await axios.get(url);
      
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
      // Mode développement : utiliser l'endpoint public pour la création
      const response = await axios.post(`${API_URL}/admin`, admin);
      console.log('✅ Administrateur créé avec succès:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erreur lors de la création de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création');
    }
  }

  async update(id: string, admin: Partial<Administrator>): Promise<Administrator> {
    console.log('✏️ Tentative de mise à jour de l\'administrateur:', id, admin);
    
    try {
      // Mode développement : pas d'authentification
      const response = await axios.put(`${API_URL}/admin/${id}`, admin);
      console.log('✅ Administrateur mis à jour avec succès:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }

  async getById(id: string): Promise<Administrator> {
    try {
      const response = await axios.get(`${API_URL}/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération');
    }
  }

  async updateProfile(id: string, profile: Partial<Administrator>): Promise<Administrator> {
    try {
      const response = await axios.patch(`${API_URL}/admin/${id}/profile`, profile);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  }

  async changePassword(id: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    try {
      await axios.patch(`${API_URL}/admin/${id}/password`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
    } catch (error: any) {
      console.error('❌ Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ Tentative de suppression de l\'administrateur:', id);
    
    try {
      // Mode développement : pas d'authentification
      await axios.delete(`${API_URL}/admin/${id}`);
      console.log('✅ Administrateur supprimé avec succès');

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de l\'administrateur:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
}

export const administratorsService = new AdministratorsService(); 