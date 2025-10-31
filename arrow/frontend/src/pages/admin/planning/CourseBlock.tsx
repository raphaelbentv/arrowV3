import React from 'react';
import { Check } from 'lucide-react';
import { CourseData } from './mock-data';
import { cn } from '@/lib/utils';

interface CourseBlockProps {
  course: CourseData;
  onClick: (course: CourseData) => void;
  onDragStart?: (course: CourseData, e: React.MouseEvent, type: 'move' | 'resize-top' | 'resize-bottom') => void;
  isDragging?: boolean;
}

const getStatusColor = (status: CourseData['status'], cohortColor: string) => {
  const colorMap: Record<string, string> = {
    blue: '#3d9bff',
    green: '#10b981',
    purple: '#a855f7',
    orange: '#f59e0b',
    red: '#ef4444',
  };

  const baseColor = colorMap[cohortColor] || colorMap.blue;

  switch (status) {
    case 'ongoing':
      return {
        background: `${baseColor}30`,
        borderColor: baseColor,
        color: baseColor,
      };
    case 'completed':
      return {
        background: `${baseColor}20`,
        borderColor: `${baseColor}60`,
        color: `${baseColor}cc`,
      };
    case 'cancelled':
      return {
        background: 'repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.1) 10px, transparent 10px, transparent 20px)',
        borderColor: '#ef4444',
        color: '#ef4444',
      };
    default:
      return {
        background: `${baseColor}25`,
        borderColor: `${baseColor}80`,
        color: baseColor,
      };
  }
};

export const CourseBlock: React.FC<CourseBlockProps> = ({ course, onClick, onDragStart, isDragging = false }) => {
  const colors = getStatusColor(course.status, course.cohortColor);
  const isOngoing = course.status === 'ongoing';

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize-top' | 'resize-bottom') => {
    if (onDragStart) {
      onDragStart(course, e, type);
    }
  };

  return (
    <div
      className={cn(
        'course-block absolute left-0 right-0 rounded-md transition-all duration-200',
        'hover:shadow-lg hover:z-10',
        isOngoing && 'animate-pulse',
        isDragging && 'opacity-50 cursor-move'
      )}
      style={{
        background: colors.background,
        borderColor: colors.borderColor,
        color: colors.color,
        borderLeftWidth: '3px',
        borderStyle: 'solid',
        cursor: isDragging ? 'move' : 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(course);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        // Détecter où on clique dans le cours
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const height = rect.height;
        
        // Si on clique dans le haut 15% -> resize-top
        if (clickY < height * 0.15) {
          handleMouseDown(e, 'resize-top');
        }
        // Si on clique dans le bas 15% -> resize-bottom
        else if (clickY > height * 0.85) {
          handleMouseDown(e, 'resize-bottom');
        }
        // Sinon -> move
        else {
          handleMouseDown(e, 'move');
        }
      }}
    >
      {/* Resize handles */}
      {onDragStart && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[15%] cursor-ns-resize z-20"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize-top');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px 4px 0 0',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[15%] cursor-ns-resize z-20"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize-bottom');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </>
      )}
      
      <div className="p-2 text-xs">
        <div className="font-bold mb-1 flex items-center justify-between">
          <span className="truncate">{course.title}</span>
          {course.attendanceDone && (
            <Check className="h-3 w-3 text-green-500 flex-shrink-0 ml-1" />
          )}
        </div>
        <div className="text-[10px] opacity-90 space-y-0.5">
          <div className="truncate">
            {formatTime(course.startTime)} • {course.cohort} • {course.room}
          </div>
          {course.instructor && (
            <div className="truncate opacity-75">{course.instructor}</div>
          )}
        </div>
      </div>
    </div>
  );
};

