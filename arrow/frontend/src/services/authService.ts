import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    email: string;
    nom: string;
    prenom: string;
    isAdmin: boolean;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 Tentative de connexion:', credentials.email);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('✅ Connexion réussie:', response.data);
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  }

  async logout(): Promise<void> {
    console.log('🚪 Déconnexion de l\'utilisateur');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getProfile(): Promise<any> {
    console.log('👤 Récupération du profil utilisateur');
    
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

      const response = await axios.get(`${API_URL}/auth/me`, config);
      console.log('✅ Profil récupéré:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  isAdmin(): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return user.isAdmin === true;
    } catch {
      return false;
    }
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
