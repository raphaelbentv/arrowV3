import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header>
        <h1>Tableau de bord</h1>
        <button onClick={logout} className="logout-btn">Déconnexion</button>
      </header>
      <div className="user-info">
        <h2>Bienvenue, {user?.email}</h2>
        <p>Rôle: {user?.role}</p>
      </div>
      
      <div className="dashboard-content">
        {user?.role === "admin" && (
          <div className="admin-panel">
            <h3>Panneau d'administration</h3>
            <ul>
              <li>Gérer les utilisateurs</li>
              <li>Gérer les intervenants</li>
              <li>Voir les statistiques</li>
            </ul>
          </div>
        )}
        
        {user?.role === "intervenant" && (
          <div className="intervenant-panel">
            <h3>Espace intervenant</h3>
            <ul>
              <li>Mes cours</li>
              <li>Mon planning</li>
              <li>Mes étudiants</li>
            </ul>
          </div>
        )}
        
        {user?.role === "etudiant" && (
          <div className="etudiant-panel">
            <h3>Espace étudiant</h3>
            <ul>
              <li>Mes cours</li>
              <li>Mon emploi du temps</li>
              <li>Mes notes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 