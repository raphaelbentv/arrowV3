import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/public/login/login';
import AdminPanel from './pages/admin/AdminPanel';
import IntervenantPanel from './pages/intervenant/IntervenantPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques sans navigation */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />

        {/* Routes authentifiées avec navigation */}
        <Route path="/admin/*" element={
          <AuthenticatedLayout>
            <AdminPanel />
          </AuthenticatedLayout>
        } />
        <Route path="/intervenant/*" element={
          <AuthenticatedLayout>
            <IntervenantPanel />
          </AuthenticatedLayout>
        } />

        {/* Redirection par défaut vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;