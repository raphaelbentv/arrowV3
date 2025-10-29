import { LucideIcon, ArrowRight } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick 
}: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        border: '3px solid',
        borderImage: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff, #3d9bff) 1',
        padding: '1.5rem',
        minHeight: '120px',
        boxShadow: '0 8px 30px rgba(61, 155, 255, 0.3)',
      }}
    >
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(61, 155, 255, 0.1) 2px, transparent 4px)',
        }}
      />

      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 0 30px rgba(61, 155, 255, 0.6), inset 0 0 30px rgba(61, 155, 255, 0.1)',
        }}
      />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div 
          className="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center border-2 border-vaporwave-blue transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{
            background: 'linear-gradient(135deg, rgba(61, 155, 255, 0.2), rgba(135, 206, 235, 0.1))',
            boxShadow: '0 0 20px rgba(61, 155, 255, 0.4)',
          }}
        >
          <Icon 
            className="w-8 h-8 text-vaporwave-blue group-hover:scale-110 transition-transform duration-500" 
            strokeWidth={2.5}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 
            className="text-xl font-black tracking-wider uppercase mb-1 transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3d9bff, #87ceeb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 8px rgba(61, 155, 255, 0.5))',
            }}
          >
            {title}
          </h3>
          <p 
            className="text-sm text-vaporwave-sky/80 group-hover:text-vaporwave-sky transition-colors duration-300"
            style={{
              textShadow: '0 0 5px rgba(135, 206, 235, 0.3)',
            }}
          >
            {description}
          </p>
        </div>

        {/* Arrow with glow */}
        <div className="relative">
          <ArrowRight 
            className="w-6 h-6 text-vaporwave-blue group-hover:translate-x-2 transition-transform duration-300" 
            strokeWidth={3}
          />
          <div 
            className="absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(61, 155, 255, 0.6), transparent)',
            }}
          />
        </div>
      </div>
    </div>
  );
}