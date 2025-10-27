import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Administrateur',
      description: 'Accès au panneau d\'administration',
      icon: Shield,
      path: '/admin/login',
      available: true,
      color: '#3d9bff'
    },
    {
      title: 'Intervenant',
      description: 'Accès à l\'espace intervenant',
      icon: User,
      path: '/login/intervenant',
      available: false,
      color: '#87ceeb'
    },
    {
      title: 'Étudiant',
      description: 'Accès à l\'espace étudiant',
      icon: GraduationCap,
      path: '/login/etudiant',
      available: false,
      color: '#5dbaff'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center w-full p-4 relative z-10">
      <div className="max-w-7xl w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl font-bold text-center mb-4 text-vaporwave text-glow">
            Bienvenue sur Arrow
          </h1>
          <h2 className="text-2xl text-center mb-12 text-muted-foreground">
            Choisissez votre espace de connexion
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 w-full">
            {loginOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.title}
                  className={`h-full flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 box-glow ${
                    !option.available ? 'opacity-70' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(61, 155, 255, 0.05) 0%, rgba(135, 206, 235, 0.05) 100%)`,
                  }}
                >
                  <div className="flex justify-center mb-4 mt-2">
                    <Icon 
                      size={60} 
                      style={{ color: option.color }}
                      className="animate-pulse"
                    />
                  </div>
                  <CardContent className="text-center flex-grow p-4">
                    <h3 className="text-2xl font-semibold mb-2">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    {!option.available && (
                      <p className="text-sm italic text-yellow-400 mt-2">
                        Bientôt disponible
                      </p>
                    )}
                  </CardContent>
                  <div className="w-full p-2">
                    <Button 
                      size="lg"
                      onClick={() => navigate(option.path)}
                      disabled={!option.available}
                      className="w-full"
                      style={option.available ? {
                        background: `linear-gradient(135deg, ${option.color}, ${option.color}dd)`,
                      } : {}}
                    >
                      Se connecter
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 