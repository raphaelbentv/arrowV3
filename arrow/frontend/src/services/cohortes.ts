import api from './api';
import { Cohorte, CreateCohorteDto, UpdateCohorteDto, AssignStudentsDto, TypeFormation, StatutCohorte, TypeFinancement } from '../types/cohorte';

export const cohortesService = {
  // Récupérer toutes les cohortes
  async getAll(): Promise<Cohorte[]> {
    const response = await api.get('/cohortes');
    return response.data;
  },

  // Récupérer une cohorte par ID
  async getById(id: string): Promise<Cohorte> {
    const response = await api.get(`/cohortes/${id}`);
    return response.data;
  },

  // Créer une nouvelle cohorte
  async create(data: CreateCohorteDto): Promise<Cohorte> {
    const response = await api.post('/cohortes', data);
    return response.data;
  },

  // Mettre à jour une cohorte
  async update(id: string, data: UpdateCohorteDto): Promise<Cohorte> {
    const response = await api.patch(`/cohortes/${id}`, data);
    return response.data;
  },

  // Supprimer une cohorte
  async delete(id: string): Promise<void> {
    await api.delete(`/cohortes/${id}`);
  },

  // Assigner des étudiants à une cohorte
  async assignStudents(id: string, data: AssignStudentsDto): Promise<Cohorte> {
    const response = await api.post(`/cohortes/${id}/students`, data);
    return response.data;
  },

  // Retirer des étudiants d'une cohorte
  async removeStudents(id: string, data: AssignStudentsDto): Promise<Cohorte> {
    const response = await api.delete(`/cohortes/${id}/students`, { data });
    return response.data;
  },

  // Assigner des intervenants à une cohorte
  async assignIntervenants(id: string, data: { intervenantId: string; volumeHoraire: number }[]): Promise<Cohorte> {
    const response = await api.post(`/cohortes/${id}/intervenants`, { intervenants: data });
    return response.data;
  },

  // Retirer des intervenants d'une cohorte
  async removeIntervenants(id: string, intervenantIds: string[]): Promise<Cohorte> {
    const response = await api.delete(`/cohortes/${id}/intervenants`, { data: { intervenantIds } });
    return response.data;
  },
};
