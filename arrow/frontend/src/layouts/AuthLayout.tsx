import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background Gradient Vaporwave */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a1a2f 20%, #1a3a5a 40%, rgba(61, 155, 255, 0.3) 80%, rgba(135, 206, 235, 0.3) 100%)',
          zIndex: 0,
        }}
      />

      {/* Grille rétro 3D */}
      <div 
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '50vh',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(61, 155, 255, 0.2) 40px, rgba(61, 155, 255, 0.2) 41px)',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
          zIndex: 0,
        }}
      />

      {/* Logo en haut */}
      <div className="absolute top-8 left-8 z-10">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="text-3xl font-black tracking-[0.25em] uppercase transition-all hover:scale-110 duration-300 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 15px rgba(61, 155, 255, 0.6))',
          }}
        >
          ARROW
        </a>
      </div>

      {/* Contenu central */}
      <div 
        className="relative z-10 w-full max-w-md px-6"
        style={{ zIndex: 10 }}
      >
        {children}
      </div>

      {/* Lien retour à l'accueil */}
      <div className="absolute bottom-8 right-8 z-10">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-105"
          style={{
            color: '#87ceeb',
            textDecoration: 'none',
          }}
        >
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default AuthLayout;
