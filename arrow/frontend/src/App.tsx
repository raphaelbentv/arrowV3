import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/public/login/login';
import AdminPanel from './pages/admin/AdminPanel';
import IntervenantPanel from './pages/intervenant/IntervenantPanel';
import AdminLogin from './pages/AdminLogin';
import HomePage from './pages/public/HomePage';
import IntervenantList from './pages/admin/intervenantList';
import { CohortesPage } from './pages/cohortes/CohortesPage';

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
              <Route path="panel/*" element={<AdminPanel />} />
              <Route path="intervenant-list" element={<IntervenantList />} />
              <Route path="cohortes" element={<CohortesPage />} />
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