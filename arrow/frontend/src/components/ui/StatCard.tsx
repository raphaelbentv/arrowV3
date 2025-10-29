import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  color?: string;
}

export function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  color = "#3d9bff" 
}: StatCardProps) {
  return (
    <div 
      className="group relative transition-all duration-500 hover:-translate-y-3 cursor-default overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '3px solid',
        borderImage: `linear-gradient(135deg, ${color}, rgba(135, 206, 235, 0.4), ${color}) 1`,
        padding: '1.5rem 1.25rem',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: `0 8px 32px ${color}44`,
      }}
    >
      {/* Scanline overlay permanent */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(61, 155, 255, 0.08) 2px, transparent 4px)',
        }}
      />

      {/* Enhanced glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 70%)`,
        }}
      />

      {/* Animated border glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 40px ${color}88, inset 0 0 40px ${color}22`,
        }}
      />

      {/* Decorative corner elements */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(135deg, ${color}40, transparent)`,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(135deg, transparent, ${color}40)`,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Floating particles */}
      <div 
        className="absolute top-4 right-8 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: color,
          boxShadow: `0 0 10px ${color}`,
          animation: 'float 3s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: '#87ceeb',
          boxShadow: '0 0 8px #87ceeb',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '0.5s',
        }}
      />

      <div className="relative space-y-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <span 
            className="text-sm font-black tracking-[0.2em] uppercase"
            style={{
              color: '#87ceeb',
              textShadow: '0 0 10px rgba(135, 206, 235, 0.5)',
            }}
          >
            {title}
          </span>
          
          {/* Icon with rotation effect */}
          <div 
            className="relative w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
            style={{
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              borderColor: color,
              boxShadow: `0 0 25px ${color}88`,
            }}
          >
            {/* Rotating glow ring */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `conic-gradient(from 0deg, ${color}, #87ceeb, ${color})`,
                filter: 'blur(6px)',
                animation: 'spin 3s linear infinite',
              }}
            />
            <Icon 
              className="relative w-7 h-7 transition-transform duration-500 group-hover:scale-110" 
              style={{ color: color }}
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Value section with decorative line */}
        <div className="space-y-4">
          {/* Decorative line above value */}
          <div className="flex items-center gap-2 mt-3">
            <div 
              className="h-0.5 w-8 transition-all duration-500 group-hover:w-12"
              style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </div>

          {/* Value with enhanced gradient */}
          <div 
            className="text-5xl font-black transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${color}, #87ceeb, #5dbaff)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 20px ${color}99)`,
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}
          >
            {value}
          </div>
        </div>

        {/* Subtitle with icon */}
        <div className="flex items-center gap-2 mt-6">
          <div 
            className="w-1 h-1 rounded-full"
            style={{
              background: '#87ceeb',
              boxShadow: '0 0 6px #87ceeb',
            }}
          />
          <p 
            className="text-sm transition-colors duration-300"
            style={{
              color: 'rgba(135, 206, 235, 0.8)',
              textShadow: '0 0 5px rgba(135, 206, 235, 0.3)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Progress bar decoration with label */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span 
              className="text-[10px] font-bold tracking-wider uppercase"
              style={{
                color: `${color}99`,
                textShadow: `0 0 5px ${color}66`,
              }}
            >
              TENDANCE
            </span>
            <div className="flex gap-1">
              <div 
                className="w-1 h-3 rounded-full opacity-60"
                style={{ background: color }}
              />
              <div 
                className="w-1 h-4 rounded-full opacity-80"
                style={{ background: color }}
              />
              <div 
                className="w-1 h-5 rounded-full"
                style={{ background: color, boxShadow: `0 0 8px ${color}` }}
              />
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden relative">
            {/* Background dots pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, ${color}44 1px, transparent 1px)`,
                backgroundSize: '4px 4px',
              }}
            />
            <div 
              className="h-full transition-all duration-1000 group-hover:w-full relative"
              style={{
                width: '70%',
                background: `linear-gradient(90deg, ${color}, #87ceeb, ${color})`,
                boxShadow: `0 0 10px ${color}, inset 0 0 5px rgba(255, 255, 255, 0.3)`,
              }}
            >
              {/* Animated shine effect */}
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}