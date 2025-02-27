import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="unauthorized-container">
      <h1>Accès non autorisé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      
      {user ? (
        <Link to="/dashboard">Retourner au tableau de bord</Link>
      ) : (
        <Link to="/login">Se connecter</Link>
      )}
    </div>
  );
};

export default Unauthorized; 