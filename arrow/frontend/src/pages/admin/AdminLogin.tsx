import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../../services/api';

const AdminLogin: React.FC = () => {
  console.log('Rendu du composant AdminLogin');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentative de connexion avec email:', email);
    setLoading(true);
    setError('');

    try {
      console.log('Envoi de la requête de connexion...');
      const response = await api.post('/auth/login', { email, password });
      console.log('Réponse reçue:', response.data);
      
      if (response.data.user && response.data.user.isAdmin) {
        console.log('Connexion réussie - Utilisateur admin');
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Rediriger vers le dashboard admin
        console.log('Redirection vers le dashboard admin');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Connexion échouée - Utilisateur non admin');
        setError('Accès réservé aux administrateurs');
        // Réinitialiser le mot de passe pour plus de sécurité
        setPassword('');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Identifiants invalides. Veuillez réessayer.');
      // Réinitialiser le mot de passe en cas d'erreur
      setPassword('');
    } finally {
      setLoading(false);
      console.log('Fin de la tentative de connexion');
    }
  };

  // Surveiller les changements d'état
  React.useEffect(() => {
    console.log('État actuel:', { email, error, loading, currentPath: location.pathname });
  }, [email, error, loading, location]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center w-full p-4 relative z-10">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="w-full max-w-md">
        <Card className="box-glow border-vaporwave">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-vaporwave text-glow">
              Connexion Administrateur
            </CardTitle>
            <p className="text-muted-foreground">
              Veuillez vous connecter pour accéder au tableau de bord
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => {
                    console.log('Email modifié:', e.target.value);
                    setEmail(e.target.value);
                  }}
                  className={error ? 'border-destructive' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    console.log('Mot de passe modifié');
                    setPassword(e.target.value);
                  }}
                  className={error ? 'border-destructive' : ''}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #3d9bff, #87ceeb)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="h-5 w-5 flex-shrink-0 text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-300">
                En mode développement, utilisez n'importe quel email/mot de passe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
