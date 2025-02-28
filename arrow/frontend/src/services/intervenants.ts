import axios from 'axios';
import { Intervenant } from '../types/intervenant';

const API_URL = 'http://localhost:4000';
const USE_MOCK_DATA = false;

// Définition de l'interface pour les méthodes du service
interface IntervenantsService {
  getAll(): Promise<Intervenant[]>;
  getOne(id: string): Promise<Intervenant>;
  create(intervenant: Omit<Intervenant, '_id'>): Promise<Intervenant>;
  update(id: string, intervenant: Partial<Intervenant>): Promise<Intervenant>;
  delete(id: string): Promise<void>;
}

export const intervenantsService: IntervenantsService = {
  getAll: async (): Promise<Intervenant[]> => {
    console.log('🚀 Démarrage de la récupération des intervenants');
    console.log('--------------------------------------------------');
    console.log('1️⃣ Vérification de la configuration');
    console.log(`   📍 URL de l'API: ${API_URL}`);
    console.log(`   🔧 Mode simulation: ${USE_MOCK_DATA ? 'activé' : 'désactivé'}`);
    console.log('--------------------------------------------------');

    try {
      console.log('2️⃣ Vérification de l\'authentification');
      const token = localStorage.getItem('token');
      if (token) {
        console.log('   ✅ Token trouvé dans le localStorage');
        console.log(`   🔑 Début du token: ${token.substring(0, 20)}...`);
      } else {
        console.log('   ❌ Aucun token trouvé dans le localStorage');
        console.log('   ⚠️ La requête risque d\'être rejetée');
      }
      console.log('--------------------------------------------------');

      console.log('3️⃣ Préparation de la requête');
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      };
      console.log('   📨 Headers de la requête:', headers);
      console.log('--------------------------------------------------');

      console.log('4️⃣ Envoi de la requête');
      console.log(`   🎯 URL complète: ${API_URL}/intervenants`);
      console.log('   ⏳ Attente de la réponse...');
      
      const response = await axios.get(`${API_URL}/intervenants`, { headers });
      
      console.log('5️⃣ Réponse reçue');
      console.log(`   ✅ Statut: ${response.status} ${response.statusText}`);
      console.log(`   📊 Nombre d'intervenants reçus: ${response.data.length}`);
      console.log('   🔍 Premier intervenant reçu:', response.data[0]);
      console.log('--------------------------------------------------');

      return response.data;
    } catch (error: any) {
      console.log('❌ ERREUR DÉTECTÉE');
      console.log('--------------------------------------------------');
      
      if (error.response) {
        console.log('📡 Détails de l\'erreur de réponse:');
        console.log(`   📊 Status: ${error.response.status}`);
        console.log(`   💬 Message: ${error.response.data?.message || 'Aucun message'}`);
        console.log('   📄 Données complètes:', error.response.data);
        console.log('   📨 Headers reçus:', error.response.headers);
      } else if (error.request) {
        console.log('📡 DIAGNOSTIC: Aucune réponse reçue du serveur');
        console.log('💡 SOLUTION: Vérifiez que:');
        console.log('   - Le serveur est démarré et accessible');
        console.log('   - L\'URL de l\'API est correcte');
        console.log('   - Pas de problème réseau');
      } else {
        console.log('⚙️ DIAGNOSTIC: Erreur de configuration');
        console.log('💡 Message d\'erreur:', error.message);
      }
      
      console.log('--------------------------------------------------');
      return [];
    }
  },

  getOne: async (id: string): Promise<Intervenant> => {
    console.log(`🔍 Début de la récupération de l'intervenant ${id}`);
    console.log('--------------------------------------------------');
    
    try {
      console.log('1️⃣ Vérification du token');
      const token = localStorage.getItem('token');
      console.log(`   🔑 Token présent: ${!!token}`);
      
      console.log('2️⃣ Préparation de la requête');
      const url = `${API_URL}/intervenants/${id}`;
      console.log(`   🎯 URL: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('3️⃣ Réponse reçue');
      console.log(`   ✅ Statut: ${response.status}`);
      console.log('   📄 Données:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.log('❌ ERREUR lors de la récupération');
      console.error('Détails:', error);
      throw error;
    }
  },

  create: async (intervenant: Omit<Intervenant, '_id'>): Promise<Intervenant> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/intervenants`, intervenant, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervenant:', error);
      throw error;
    }
  },

  update: async (id: string, intervenant: Partial<Intervenant>): Promise<Intervenant> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/intervenants/${id}`, intervenant, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'intervenant ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/intervenants/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'intervenant ${id}:`, error);
      throw error;
    }
  }
};