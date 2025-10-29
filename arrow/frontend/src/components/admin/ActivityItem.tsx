import React from 'react';
import { UserPlus, CalendarPlus, Edit, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  icon: 'UserPlus' | 'CalendarPlus' | 'Edit' | 'Phone';
  title: string;
  timestamp: Date;
  user?: string;
  color?: string;
}

const iconMap = {
  UserPlus,
  CalendarPlus,
  Edit,
  Phone,
};

export function ActivityItem({ icon, title, timestamp, user, color = '#3B82F6' }: ActivityItemProps) {
  const Icon = iconMap[icon];
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div
        className="p-2 rounded-lg flex-shrink-0"
        style={{
          background: `${color}20`,
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: '#3d9bff' }}>
          {title}
        </p>
        {user && (
          <p className="text-xs text-gray-400 mt-1">
            {user}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {timeAgo}
        </p>
      </div>
    </div>
  );
}

