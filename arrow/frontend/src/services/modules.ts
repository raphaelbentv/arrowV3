import api from './api';
import { ModuleCours } from '../types/module';

const API_URL = (api.defaults.baseURL as string | undefined) || 'http://localhost:4000/api/v1';

interface ModulesService {
  getAll(): Promise<ModuleCours[]>;
  getOne(id: string): Promise<ModuleCours>;
  create(payload: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>): Promise<ModuleCours>;
  update(id: string, payload: Partial<ModuleCours>): Promise<ModuleCours>;
  delete(id: string): Promise<void>;
}

export const modulesService: ModulesService = {
  async getAll(): Promise<ModuleCours[]> {
    const response = await api.get(`/modules`);
    return response.data;
  },
  async getOne(id: string): Promise<ModuleCours> {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  },
  async create(payload: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>): Promise<ModuleCours> {
    const response = await api.post(`/modules`, payload);
    return response.data;
  },
  async update(id: string, payload: Partial<ModuleCours>): Promise<ModuleCours> {
    const response = await api.patch(`/modules/${id}`, payload);
    return response.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/modules/${id}`);
  },
};


