import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Utilise l'URL du backend définie dans .env
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;