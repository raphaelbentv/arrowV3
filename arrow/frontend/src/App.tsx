import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/public';
import MainLayout from './components/layout/MainLayout';
import Intervenants from "./components/intervenants";
import IntervenantDetail from "./pages/IntervenantDetail";
import AddIntervenant from "./pages/AddIntervenant";
import Login from "./pages/public/login/login";
import { useEffect, useState } from 'react';
import { Intervenant } from './types/intervenant';
import { intervenantsService } from './services/intervenants';
import theme from './styles/theme';

function App() {
  const [, setIntervenants] = useState<Intervenant[]>([]);
  const [] = useState<Intervenant | null>(null);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        const data = await intervenantsService.getAll();
        setIntervenants(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
      }
    };
    fetchIntervenants();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/intervenants" element={<Intervenants />} />
            <Route 
              path="/intervenants/:id" 
              element={
                <IntervenantDetail />
              } 
            />
            <Route path="/add-intervenant" element={<AddIntervenant />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;