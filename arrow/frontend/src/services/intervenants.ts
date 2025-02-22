import api from './api';
import { Intervenant } from '../types/intervenant';

export const intervenantsService = {
  getAll: async (): Promise<Intervenant[]> => {
    try {
      const response = await api.get('/intervenants');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des intervenants:', error);
      throw error;
    }
  },
  getOne: async (id: string): Promise<Intervenant> => {
    try {
      const response = await api.get(`/intervenants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'intervenant ${id}:`, error);
      throw error;
    }
  }
};