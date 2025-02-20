import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Changement ici
import { theme } from './theme';
import Home from './pages/public';
import MainLayout from './components/layout/MainLayout';
import Intervenants from "./components/intervenants";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Switch> {/* Changement ici, on utilise Switch au lieu de Routes */}
            <Route exact path="/" component={Home} />
            <Route path="/intervenants" component={Intervenants} />
          </Switch>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;