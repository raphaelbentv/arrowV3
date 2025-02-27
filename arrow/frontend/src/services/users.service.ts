import api from './api';

export const UsersService = {
  // Pour récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Pour récupérer un utilisateur spécifique
  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
      throw error;
    }
  },

  // Autres méthodes (create, update, delete)...
};

export default UsersService;