import axios from 'axios';
import { Intervenant } from '../types/intervenant';

const API_URL = 'http://localhost:4000';

export const intervenantsService = {
  getAll: async (): Promise<Intervenant[]> => {
    try {
      const response = await axios.get(`${API_URL}/intervenants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des intervenants:', error);
      throw error;
    }
  },
  getOne: async (id: string): Promise<Intervenant> => {
    try {
      const response = await axios.get(`${API_URL}/intervenants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'intervenant ${id}:`, error);
      throw error;
    }
  }
};