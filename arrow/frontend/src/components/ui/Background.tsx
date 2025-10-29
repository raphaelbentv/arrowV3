export function Background() {
    return (
      <>
        {/* Gradient Vaporwave */}
        <div 
          className="fixed inset-0 z-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a1a2f 20%, #1a3a5a 40%, rgba(61, 155, 255, 0.3) 80%, rgba(135, 206, 235, 0.3) 100%)',
          }}
        />
  
        {/* Grille rétro 3D */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-1/2 z-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(61, 155, 255, 0.2) 40px, rgba(61, 155, 255, 0.2) 41px)',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        />
      </>
    );
  }