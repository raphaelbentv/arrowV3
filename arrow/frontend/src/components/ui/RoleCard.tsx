import { LucideIcon, ArrowRight } from "lucide-react";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
}

export function RoleCard({ 
  icon: Icon, 
  title, 
  description, 
  href,
  disabled = false 
}: RoleCardProps) {
  const handleClick = () => {
    if (href && !disabled) {
      window.location.href = href;
    }
  };

  return (
    <div
      className={`
        group relative transition-all duration-300
        ${disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'cursor-pointer hover:scale-105 hover:-translate-y-3'
        }
      `}
      onClick={disabled ? undefined : handleClick}
      style={{
        background: disabled ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.8)',
        border: '4px solid',
        borderImage: disabled 
          ? undefined 
          : 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff, #3d9bff) 1',
        borderColor: disabled ? 'rgba(61, 155, 255, 0.2)' : undefined,
        padding: '2.5rem 2rem',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: disabled 
          ? '0 10px 40px rgba(61, 155, 255, 0.15)' 
          : '0 10px 40px rgba(61, 155, 255, 0.4)',
      }}
    >
      {/* Scanline overlay */}
      {!disabled && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(61, 155, 255, 0.1) 2px, transparent 4px)',
          }}
        />
      )}

       {/* Content */}
       <div className="relative flex flex-col justify-between h-full" style={{ gap: '1.75rem' }}>
         
         {/* Icon - Style vintage badge */}
         <div className="flex justify-center pt-2">
           <div
            className={`
              relative w-28 h-28 transition-all duration-500
              ${disabled 
                ? '' 
                : 'group-hover:rotate-12 group-hover:scale-110'
              }
            `}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              background: disabled 
                ? 'rgba(61, 155, 255, 0.1)' 
                : 'linear-gradient(135deg, #3d9bff, #87ceeb)',
              boxShadow: disabled 
                ? undefined 
                : '0 0 30px rgba(61, 155, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon 
                className={`w-14 h-14 ${disabled ? 'text-vaporwave-blue/40' : 'text-black'}`}
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

         {/* Title - Retro style */}
         <div className="px-4 py-2">
           <h3 
             className="text-center text-3xl font-black tracking-[0.2em] uppercase mb-3"
            style={disabled ? {
              color: 'rgba(93, 186, 255, 0.5)',
            } : {
              background: 'linear-gradient(180deg, #3d9bff, #87ceeb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(61, 155, 255, 0.8)',
              filter: 'drop-shadow(0 4px 8px rgba(61, 155, 255, 0.4))',
            }}
          >
            {title}
          </h3>
          
           {/* Underline decoration */}
           {!disabled && (
             <div 
               className="h-1 mx-auto transition-all duration-300 mt-2"
               style={{
                 width: '60%',
                 background: 'linear-gradient(90deg, transparent, #3d9bff, transparent)',
                 boxShadow: '0 0 10px #3d9bff',
               }}
             />
           )}
         </div>
 
         {/* Description */}
         <p 
           className={`
             text-center text-base leading-relaxed px-6 py-3
             ${disabled ? 'text-vaporwave-sky/40' : 'text-vaporwave-sky/90'}
           `}
           style={{
             lineHeight: '1.7',
           }}
         >
           {description}
         </p>

        {/* Button - Retro arcade style */}
        <div className="pt-3 px-4 pb-1">
          <button
            disabled={disabled}
            className={`
              w-full py-4 px-6 text-base font-black tracking-[0.2em] uppercase
              transition-all duration-300 relative overflow-hidden
              ${disabled 
                ? 'bg-gray-900 border-2 border-vaporwave-blue/20 text-vaporwave-blue/40 cursor-not-allowed' 
                : 'border-4 border-vaporwave-blue hover:-translate-y-1'
              }
            `}
            style={disabled ? undefined : {
              background: 'linear-gradient(180deg, #3d9bff, #5dbaff)',
              boxShadow: '0 6px 0 #0a4d80, 0 8px 20px rgba(61, 155, 255, 0.4)',
            }}
            onClick={disabled ? undefined : handleClick}
          >
            {/* Button shine effect */}
            {!disabled && (
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shine 1.5s infinite',
                }}
              />
            )}
            
            <span className="relative z-10 flex items-center justify-center gap-3 text-black">
              {disabled ? (
                'BIENTÔT DISPONIBLE'
              ) : (
                <>
                  ACCÉDER
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>

      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}