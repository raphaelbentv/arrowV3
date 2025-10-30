import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import IntervenantPanel from './pages/intervenant/IntervenantPanel';
import AdminLogin from './pages/admin/AdminLogin';
import HomePage from './pages/public/HomePage';
import IntervenantList from './pages/admin/intervenantList';
import { CohortesPage } from './pages/cohortes/CohortesPage';
import { CohorteDetailPage } from './pages/cohortes/CohorteDetailPage';
import AdministratorList from './pages/admin/AdministratorList';
import { EtudiantDetailPage } from './pages/admin/EtudiantDetailPage';
import { EtudiantsPage } from './pages/admin/EtudiantsPage';
import { CallsPage } from './pages/admin/CallsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Routes admin protégées */}
        <Route path="/admin/*" element={
          <AuthenticatedLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="intervenant-list" element={<IntervenantList />} />
              <Route path="cohortes" element={<CohortesPage />} />
              <Route path="cohortes/:id" element={<CohorteDetailPage />} />
              <Route path="students" element={<EtudiantsPage />} />
              <Route path="students/:id" element={<EtudiantDetailPage />} />
              <Route path="calls" element={<CallsPage />} />
              <Route path="administrators" element={<AdministratorList />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AuthenticatedLayout>
        } />

        {/* Routes intervenant protégées */}
        <Route path="/intervenant/*" element={
          <AuthenticatedLayout>
            <Routes>
              <Route index element={<IntervenantPanel />} />
            </Routes>
          </AuthenticatedLayout>
        } />

        {/* Redirection des routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;