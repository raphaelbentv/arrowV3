import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color?: string;
  path: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color = '#FFD700',
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      className="h-full cursor-pointer border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
      style={{
        ['--hover-shadow' as string]: `0 12px 32px ${color}25`,
      }}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}15` }}
        >
          {React.cloneElement(icon, {
            style: { fontSize: 36, color },
            className: 'w-9 h-9'
          })}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {description}
        </p>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="action-icon bg-white/5 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:text-black"
            style={{
              ['--hover-bg' as string]: color,
            }}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;