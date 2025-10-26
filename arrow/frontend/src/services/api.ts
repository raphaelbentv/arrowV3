import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// MODE DÉVELOPPEMENT : Désactivation de l'authentification
const DEV_MODE = true; // Mettre à false en production

if (!DEV_MODE) {
  // Intercepteur pour ajouter le token à chaque requête (PRODUCTION)
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercepteur pour gérer les erreurs d'authentification (PRODUCTION)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Vérifier si l'erreur est 401 (non autorisé)
      if (error.response && error.response.status === 401) {
        // Ne pas rediriger si on est déjà sur une page de connexion
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('/login') || currentPath.includes('/admin/login');
        
        if (!isLoginPage) {
          console.log('Redirection vers la page de connexion suite à une erreur 401');
          // Rediriger vers la page de connexion si le token est invalide
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.log('Erreur 401 sur la page de connexion - pas de redirection');
        }
      }
      return Promise.reject(error);
    }
  );
} else {
  // MODE DÉVELOPPEMENT : Pas d'authentification
  console.log('🔧 MODE DÉVELOPPEMENT : Authentification désactivée');
}

export default api;