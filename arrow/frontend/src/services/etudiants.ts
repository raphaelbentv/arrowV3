import api from './api';
import { Etudiant, CreateEtudiantDto, UpdateEtudiantDto } from '../types/etudiant';

export const etudiantsService = {
  // Récupérer tous les étudiants
  async getAll(cohorteId?: string): Promise<Etudiant[]> {
    const params = cohorteId ? { cohorte: cohorteId } : {};
    const response = await api.get('/etudiants', { params });
    return response.data;
  },

  // Récupérer un étudiant par ID
  async getById(id: string): Promise<Etudiant> {
    const response = await api.get(`/etudiants/${id}`);
    return response.data;
  },

  // Créer un nouvel étudiant
  async create(data: CreateEtudiantDto): Promise<Etudiant> {
    const response = await api.post('/etudiants', data);
    return response.data;
  },

  // Mettre à jour un étudiant
  async update(id: string, data: UpdateEtudiantDto): Promise<Etudiant> {
    const response = await api.patch(`/etudiants/${id}`, data);
    return response.data;
  },

  // Supprimer un étudiant
  async delete(id: string): Promise<void> {
    await api.delete(`/etudiants/${id}`);
  },

  // Obtenir les statistiques
  async getStats() {
    const response = await api.get('/etudiants/stats');
    return response.data;
  },
};
