import { ShieldCheck, UserCog, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      
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

      {/* Contenu principal */}
      <div className="relative px-4 py-12" style={{ zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 
              style={{
                fontSize: 'clamp(3rem, 12vw, 8rem)',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.5))',
                marginBottom: '1.5rem',
              }}
            >
              ARROW
            </h1>
            
            <p 
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#87ceeb',
                textShadow: '0 0 10px rgba(135, 206, 235, 0.5)',
                marginBottom: '0.5rem',
              }}
            >
              Plateforme de gestion
            </p>
            
            <p style={{ color: 'rgba(135, 206, 235, 0.7)', fontSize: '1rem' }}>
              Choisissez votre espace pour commencer
            </p>
          </header>

          {/* Grille de cartes */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            
            {/* Card Administrateur - ACTIVE */}
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '3px solid',
                borderImage: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff) 1',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(61, 155, 255, 0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(61, 155, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(61, 155, 255, 0.25)';
              }}
              onClick={() => navigate('/admin/dashboard')}
            >
              {/* Icon */}
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 1.5rem', 
                background: 'rgba(61, 155, 255, 0.1)',
                border: '2px solid #3d9bff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(61, 155, 255, 0.4)',
              }}>
                <ShieldCheck size={40} color="#3d9bff" strokeWidth={2.5} />
              </div>

              {/* Titre */}
              <h2 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #3d9bff, #87ceeb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Administrateur
              </h2>

              {/* Description */}
              <p style={{ 
                textAlign: 'center', 
                color: 'rgba(135, 206, 235, 0.8)', 
                fontSize: '0.9rem',
                lineHeight: '1.5',
                marginBottom: '1.5rem',
              }}>
                Gérez l'établissement, les utilisateurs et les paramètres globaux.
              </p>

              {/* Bouton */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/dashboard');
                }}
                style={{
                  width: '100%',
                  height: '44px',
                  background: 'linear-gradient(to right, #3d9bff, #5dbaff)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(61, 155, 255, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(61, 155, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(61, 155, 255, 0.3)';
                }}
              >
                Accéder
              </button>
            </div>

            {/* Card Intervenant - DÉSACTIVÉE */}
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '3px solid rgba(61, 155, 255, 0.15)',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(61, 155, 255, 0.1)',
                opacity: 0.6,
                cursor: 'not-allowed',
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 1.5rem', 
                background: 'rgba(93, 186, 255, 0.05)',
                border: '2px solid rgba(93, 186, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UserCog size={40} color="rgba(93, 186, 255, 0.4)" strokeWidth={2.5} />
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '1rem',
                color: 'rgba(93, 186, 255, 0.5)',
              }}>
                Intervenant
              </h2>

              <p style={{ 
                textAlign: 'center', 
                color: 'rgba(135, 206, 235, 0.4)', 
                fontSize: '0.9rem',
                lineHeight: '1.5',
                marginBottom: '1.5rem',
              }}>
                Gérez vos cours, suivez vos étudiants et accédez aux ressources.
              </p>

              <button
                disabled
                style={{
                  width: '100%',
                  height: '44px',
                  background: '#1a1a1a',
                  color: 'rgba(93, 186, 255, 0.4)',
                  border: '2px solid rgba(61, 155, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'not-allowed',
                }}
              >
                Bientôt disponible
              </button>
            </div>

            {/* Card Étudiant - DÉSACTIVÉE */}
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '3px solid rgba(61, 155, 255, 0.15)',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(61, 155, 255, 0.1)',
                opacity: 0.6,
                cursor: 'not-allowed',
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 1.5rem', 
                background: 'rgba(93, 186, 255, 0.05)',
                border: '2px solid rgba(93, 186, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <GraduationCap size={40} color="rgba(93, 186, 255, 0.4)" strokeWidth={2.5} />
              </div>

              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '1rem',
                color: 'rgba(93, 186, 255, 0.5)',
              }}>
                Étudiant
              </h2>

              <p style={{ 
                textAlign: 'center', 
                color: 'rgba(135, 206, 235, 0.4)', 
                fontSize: '0.9rem',
                lineHeight: '1.5',
                marginBottom: '1.5rem',
              }}>
                Consultez vos cours, rendus et informations administratives.
              </p>

              <button
                disabled
                style={{
                  width: '100%',
                  height: '44px',
                  background: '#1a1a1a',
                  color: 'rgba(93, 186, 255, 0.4)',
                  border: '2px solid rgba(61, 155, 255, 0.15)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'not-allowed',
                }}
              >
                Bientôt disponible
              </button>
            </div>

          </div>

          {/* Footer */}
          <footer style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <p style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(93, 186, 255, 0.5)',
              textShadow: '0 0 8px rgba(93, 186, 255, 0.3)',
            }}>
              © 2025 Arrow Platform · Sky Wave System
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}