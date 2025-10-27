import { ShieldCheck, UserCog, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      
      {/* ===== BACKGROUNDS LAYERS ===== */}
      
      {/* Gradient Vaporwave */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a1a2f 20%, #1a3a5a 40%, rgba(61, 155, 255, 0.3) 80%, rgba(135, 206, 235, 0.3) 100%)',
          }}
        />
      </div>

      {/* Grille rétro 3D */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-1/2 z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(61, 155, 255, 0.2) 40px,
            rgba(61, 155, 255, 0.2) 41px
          )`,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* ===== CONTENT ===== */}
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-16 space-y-6">
            <h1 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[0.15em] uppercase"
              style={{
                background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.5))',
              }}
            >
              ARROW
            </h1>
            
            <div className="space-y-2">
              <p 
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-[#87ceeb]"
                style={{ textShadow: '0 0 10px rgba(135, 206, 235, 0.5)' }}
              >
                Plateforme de gestion
              </p>
              <p className="text-sm sm:text-base text-[#87ceeb]/70 tracking-wide">
                Choisissez votre espace pour commencer
              </p>
            </div>
          </header>

          {/* Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            
            {/* ADMINISTRATEUR - Actif */}
            <Card 
              className="group relative bg-black/70 border-[3px] transition-all duration-300 hover:scale-105"
              style={{
                borderImage: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff) 1',
                boxShadow: '0 8px 32px rgba(61, 155, 255, 0.25)',
              }}
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(61, 155, 255, 0.03) 2px, transparent 4px)',
                  }}
                />
              </div>

              <CardHeader className="text-center space-y-4 pt-8 pb-4">
                <div 
                  className="w-20 h-20 mx-auto rounded-xl bg-[#3d9bff]/10 border-2 border-[#3d9bff] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ boxShadow: '0 0 20px rgba(61, 155, 255, 0.4)' }}
                >
                  <ShieldCheck className="w-10 h-10 text-[#3d9bff]" strokeWidth={2.5} />
                </div>
                
                <CardTitle 
                  className="text-2xl font-extrabold tracking-[0.15em] uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #3d9bff, #87ceeb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Administrateur
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <p className="text-center text-[#87ceeb]/80 text-sm leading-relaxed">
                  Gérez l'établissement, les utilisateurs et les paramètres globaux de la plateforme.
                </p>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button
                  onClick={() => window.location.href = "/admin"}
                  className="w-full h-11 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-[#3d9bff] to-[#5dbaff] text-black border-none hover:shadow-[0_0_20px_rgba(61,155,255,0.6)] hover:translate-y-[-2px] transition-all duration-300"
                >
                  Accéder
                </Button>
              </CardFooter>
            </Card>

            {/* INTERVENANT - Désactivé */}
            <Card 
              className="relative bg-black/60 border-[3px] border-[#3d9bff]/15 opacity-60 cursor-not-allowed"
              style={{ boxShadow: '0 8px 32px rgba(61, 155, 255, 0.1)' }}
            >
              <CardHeader className="text-center space-y-4 pt-8 pb-4">
                <div 
                  className="w-20 h-20 mx-auto rounded-xl bg-[#5dbaff]/5 border-2 border-[#5dbaff]/20 flex items-center justify-center"
                >
                  <UserCog className="w-10 h-10 text-[#5dbaff]/40" strokeWidth={2.5} />
                </div>
                
                <CardTitle className="text-2xl font-extrabold tracking-[0.15em] uppercase text-[#5dbaff]/50">
                  Intervenant
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <p className="text-center text-[#87ceeb]/40 text-sm leading-relaxed">
                  Gérez vos cours, suivez vos étudiants et accédez aux ressources pédagogiques.
                </p>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button
                  disabled
                  className="w-full h-11 text-sm font-bold tracking-wider uppercase bg-[#1a1a1a] border-2 border-[#3d9bff]/15 text-[#5dbaff]/40 cursor-not-allowed"
                >
                  Bientôt disponible
                </Button>
              </CardFooter>
            </Card>

            {/* ÉTUDIANT - Désactivé */}
            <Card 
              className="relative bg-black/60 border-[3px] border-[#3d9bff]/15 opacity-60 cursor-not-allowed"
              style={{ boxShadow: '0 8px 32px rgba(61, 155, 255, 0.1)' }}
            >
              <CardHeader className="text-center space-y-4 pt-8 pb-4">
                <div 
                  className="w-20 h-20 mx-auto rounded-xl bg-[#5dbaff]/5 border-2 border-[#5dbaff]/20 flex items-center justify-center"
                >
                  <GraduationCap className="w-10 h-10 text-[#5dbaff]/40" strokeWidth={2.5} />
                </div>
                
                <CardTitle className="text-2xl font-extrabold tracking-[0.15em] uppercase text-[#5dbaff]/50">
                  Étudiant
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <p className="text-center text-[#87ceeb]/40 text-sm leading-relaxed">
                  Consultez vos cours, rendus et informations administratives personnelles.
                </p>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button
                  disabled
                  className="w-full h-11 text-sm font-bold tracking-wider uppercase bg-[#1a1a1a] border-2 border-[#3d9bff]/15 text-[#5dbaff]/40 cursor-not-allowed"
                >
                  Bientôt disponible
                </Button>
              </CardFooter>
            </Card>

          </section>

          {/* Footer */}
          <footer className="text-center pt-8">
            <p 
              className="text-xs sm:text-sm tracking-widest uppercase text-[#5dbaff]/50"
              style={{ textShadow: '0 0 8px rgba(93, 186, 255, 0.3)' }}
            >
              © 2025 Arrow Platform · Sky Wave System
            </p>
          </footer>

        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
      `}</style>
    </div>
  );
}