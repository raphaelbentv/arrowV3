import api from "./api";

export const getIntervenants = async () => {
  try {
    const response = await api.get("/intervenants");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des intervenants:", error);
    return [];
  }
};