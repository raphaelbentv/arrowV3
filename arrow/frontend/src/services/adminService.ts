import api from './api';

export const AdminService = {
  // Utilisateurs
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData: any) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  // Intervenants
  getAllIntervenants: async () => {
    const response = await api.get('/admin/intervenants');
    return response.data;
  },
  
  // Statistiques
  getStats: async () => {
    const usersCount = await api.get('/admin/users/count');
    const intervenantsCount = await api.get('/admin/intervenants/count');
    
    return {
      totalUsers: usersCount.data.count,
      totalIntervenants: intervenantsCount.data.count,
      totalCourses: 0 // À implémenter
    };
  }
};

export default AdminService;
