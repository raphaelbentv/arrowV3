import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import IntervenantDetail from "./pages/IntervenantDetail";
import AddIntervenant from "./pages/AddIntervenant";
import Login from "./pages/public/login/login";
import { useEffect, useState } from 'react';
import { Intervenant } from './types/intervenant';
import theme from './styles/theme';
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/public/Unauthorized";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [, setIntervenants] = useState<Intervenant[]>([]);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        // Commentez temporairement l'appel API réel
        // const data = await intervenantsService.getAll();
        
        // Utilisez des données fictives à la place
        const mockData: Intervenant[] = [
          { 
            _id: '1', 
            nom: 'Dupont', 
            prenom: 'Jean', 
            email: 'jean.dupont@example.com',
            statut: 'Disponible',
            typeContrat: 'CDI',
            telephone: '0123456789',
            poste: 'Développeur',
            experience: 5, // Changé de string à number pour correspondre au type attendu
            competences: ['React', 'TypeScript']
          },
          { 
            _id: '2', 
            nom: 'Martin', 
            prenom: 'Sophie', 
            email: 'sophie.martin@example.com',
            statut: 'Disponible',
            typeContrat: 'Freelance',
            telephone: '0987654321',
            poste: 'Designer',
            experience: 3, // Changé de string à number pour correspondre au type attendu
            competences: ['UI/UX', 'Figma']
          }
        ];
        // Conversion des données mock pour correspondre au type Intervenant
        const formattedMockData: Intervenant[] = mockData.map(item => ({
          _id: item._id,
          nom: item.nom,
          prenom: item.prenom,
          email: item.email,
          statut: item.statut,
          typeContrat: item.typeContrat,
          telephone: item.telephone,
          poste: item.poste,
          experience: item.experience,
          competences: item.competences
        }));
        
        setIntervenants(formattedMockData);
      } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
      }
    };
    fetchIntervenants();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute requiredRoles={["admin"]}>
                    <AdminPanel />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/intervenants/add" 
                element={
                  <PrivateRoute requiredRoles={["admin"]}>
                    <AddIntervenant />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/intervenants/:id" 
                element={
                  <PrivateRoute>
                    <IntervenantDetail />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;