import api from './api';

export interface SchoolData {
  _id?: string;
  // Identité
  nomEcole: string;
  raisonSociale?: string;
  numeroSIRET: string;
  codeUAI?: string;
  
  // Coordonnées
  adresseNumeroRue: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb?: string;
  
  // Direction
  nomDirecteur: string;
  emailDirecteur: string;
  nomResponsablePedagogique: string;
  emailResponsablePedagogique: string;
  
  // Branding
  logo?: string;
  couleurPrincipale?: string;
}

export const schoolService = {
  // Récupérer la configuration de l'école
  async get(): Promise<SchoolData | null> {
    try {
      const response = await api.get('/school');
      return response.data;
    } catch (error: any) {
      // Si 404, retourner null (pas encore configuré)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Créer ou mettre à jour la configuration de l'école
  async createOrUpdate(data: Partial<SchoolData>): Promise<SchoolData> {
    const response = await api.post('/school', data);
    return response.data;
  },

  // Mettre à jour la configuration de l'école
  async update(data: Partial<SchoolData>): Promise<SchoolData> {
    const response = await api.patch('/school', data);
    return response.data;
  },
};


