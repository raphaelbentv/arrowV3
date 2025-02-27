import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour charger les utilisateurs
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Impossible de charger les utilisateurs' as any);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Affichage des utilisateurs...
  return (
    <div>
      {/* Votre code d'affichage ici */}
    </div>
  );
};

export default UsersList;