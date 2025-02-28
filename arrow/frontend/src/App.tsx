import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import theme from './styles/theme';
import { AuthProvider } from "./context/authContext";
import Unauthorized from "./pages/public/Unauthorized";
import AdminLogin from './pages/AdminLogin';
import Dashboard from "./pages/Dashboard";
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import CreateAdmin from './pages/CreateAdmin';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <MainLayout>
            <Routes>
              {/* Page d'accueil avec choix du type de connexion */}
              <Route path="/" element={<HomePage />} />
              
              {/* Page de connexion admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Page non autorisée */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Routes protégées pour l'administration */}
              <Route path="/dashboard" element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/create" element={
                <AdminRoute>
                  <CreateAdmin />
                </AdminRoute>
              } />
              
              {/* Pages de connexion (à implémenter plus tard) */}
              <Route path="/login/intervenant" element={<Navigate to="/unauthorized" />} />
              <Route path="/login/etudiant" element={<Navigate to="/unauthorized" />} />
              
              {/* Redirection des routes inconnues vers la page d'accueil */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;