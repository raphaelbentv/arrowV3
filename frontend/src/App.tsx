import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import Home from './pages/public';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Autres routes à ajouter plus tard */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 