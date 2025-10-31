import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar, Check, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CourseBlock } from './planning/CourseBlock';
import { coursesData, cohorts, instructors, rooms, CourseData } from './planning/mock-data';
import { SearchFiltersCard, FilterConfig } from '@/components/ui/SearchFiltersCard';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';

type ViewType = 'month' | 'week' | 'day' | 'list';

export const PlanningPage: React.FC = () => {
  const [view, setView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [selectedCohorte, setSelectedCohorte] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWeekends, setShowWeekends] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // States for drag selection (new course creation)
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ dayOfWeek: number; timeSlot: string } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ dayOfWeek: number; timeSlot: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourseData, setNewCourseData] = useState<{ dayOfWeek: number; startTime: string; endTime: string } | null>(null);
  
  // States for dragging existing courses (move/resize)
  const [draggedCourse, setDraggedCourse] = useState<CourseData | null>(null);
  const [isDraggingCourse, setIsDraggingCourse] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-top' | 'resize-bottom' | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ dayOfWeek: number; timeSlot: string; mouseY: number } | null>(null);
  const [dragCurrentPosition, setDragCurrentPosition] = useState<{ dayOfWeek: number; timeSlot: string } | null>(null);
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [courseUpdateData, setCourseUpdateData] = useState<{ course: CourseData; newDayOfWeek: number; newStartTime: string; newEndTime: string } | null>(null);
  
  // State for courses list (initially from mock data)
  const [courses, setCourses] = useState<CourseData[]>(coursesData);
  
  // State for form data in create modal
  const [createFormData, setCreateFormData] = useState<{
    title: string;
    cohortId: string;
    instructorId: string;
    roomId: string;
  }>({
    title: '',
    cohortId: '',
    instructorId: '',
    roomId: '',
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle global mouse up for drag selection
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && selectionStart && selectionEnd) {
        // Calculate start and end times
        const startSlot = selectionStart.timeSlot;
        const endSlot = selectionEnd.timeSlot;
        
        // If same day, calculate duration
        if (selectionStart.dayOfWeek === selectionEnd.dayOfWeek) {
          const [startHour, startMin] = startSlot.split(':').map(Number);
          const [endHour, endMin] = endSlot.split(':').map(Number);
          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;
          
          // Ensure end is after start (swap if needed)
          const finalStart = startMinutes < endMinutes ? startSlot : endSlot;
          const finalEnd = startMinutes < endMinutes ? endSlot : startSlot;
          
          setNewCourseData({
            dayOfWeek: selectionStart.dayOfWeek,
            startTime: finalStart,
            endTime: finalEnd || `${(Math.max(endHour, startHour) + 1).toString().padStart(2, '0')}:${Math.max(endMin, startMin).toString().padStart(2, '0')}`,
          });
          setShowCreateModal(true);
        }
        
        setIsDragging(false);
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    };

    const handleGlobalMouseUpCourse = () => {
      if (isDraggingCourse && draggedCourse && dragStartPosition && dragCurrentPosition && dragType) {
        // Call the drag end logic inline to avoid dependency issues
        const course = draggedCourse;
        const [originalStartHour, originalStartMin] = course.startTime.split(':').map(Number);
        const [originalEndHour, originalEndMin] = course.endTime.split(':').map(Number);
        const originalStartMinutes = originalStartHour * 60 + originalStartMin;
        const originalEndMinutes = originalEndHour * 60 + originalEndMin;

        const [startSlotHour, startSlotMin] = dragStartPosition.timeSlot.split(':').map(Number);
        const [currentSlotHour, currentSlotMin] = dragCurrentPosition.timeSlot.split(':').map(Number);
        const startSlotMinutes = startSlotHour * 60 + startSlotMin;
        const currentSlotMinutes = currentSlotHour * 60 + currentSlotMin;
        const dragDeltaMinutes = currentSlotMinutes - startSlotMinutes;

        let newStartMinutes = originalStartMinutes;
        let newEndMinutes = originalEndMinutes;
        let newDayOfWeek = course.dayOfWeek;

        if (dragType === 'move') {
          newStartMinutes = originalStartMinutes + dragDeltaMinutes;
          newEndMinutes = originalEndMinutes + dragDeltaMinutes;
          newDayOfWeek = dragCurrentPosition.dayOfWeek;
        } else if (dragType === 'resize-top') {
          newStartMinutes = originalStartMinutes + dragDeltaMinutes;
          if (newStartMinutes >= originalEndMinutes) {
            newStartMinutes = originalEndMinutes - 30;
          }
          newDayOfWeek = dragCurrentPosition.dayOfWeek;
        } else if (dragType === 'resize-bottom') {
          newEndMinutes = originalEndMinutes + dragDeltaMinutes;
          if (newEndMinutes <= originalStartMinutes) {
            newEndMinutes = originalStartMinutes + 30;
          }
        }

        const newStartHour = Math.floor(newStartMinutes / 60);
        const newStartMin = newStartMinutes % 60;
        const newEndHour = Math.floor(newEndMinutes / 60);
        const newEndMin = newEndMinutes % 60;

        const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMin.toString().padStart(2, '0')}`;
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;

        const hasChanged = 
          newDayOfWeek !== course.dayOfWeek ||
          newStartTime !== course.startTime ||
          newEndTime !== course.endTime;

        if (hasChanged) {
          setCourseUpdateData({
            course,
            newDayOfWeek,
            newStartTime,
            newEndTime,
          });
          setShowUpdateConfirmModal(true);
        }

        setIsDraggingCourse(false);
        setDraggedCourse(null);
        setDragType(null);
        setDragStartPosition(null);
        setDragCurrentPosition(null);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      // Prevent text selection during drag
      const preventSelect = (e: MouseEvent) => {
        if (isDragging) {
          e.preventDefault();
        }
      };
      document.addEventListener('selectstart', preventSelect);
    }

    if (isDraggingCourse) {
      document.addEventListener('mouseup', handleGlobalMouseUpCourse);
      
      // Track mouse move globally for course dragging
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDraggingCourse && draggedCourse && dragCurrentPosition) {
          // Find which cell the mouse is over
          // We'll update dragCurrentPosition based on mouse position
          // For now, we'll let the cell's onMouseMove handle it
        }
      };
      
      const preventSelect = (e: MouseEvent) => {
        if (isDraggingCourse) {
          e.preventDefault();
        }
      };
      document.addEventListener('selectstart', preventSelect);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.body.style.cursor = 'move';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUpCourse);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('selectstart', preventSelect);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseup', handleGlobalMouseUpCourse);
      document.removeEventListener('selectstart', () => {});
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, selectionStart, selectionEnd, isDraggingCourse, draggedCourse, dragStartPosition, dragCurrentPosition, dragType]);

  // Get week range
  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const weekRange = getWeekRange(currentDate);

  const formatDateRange = () => {
    const start = weekRange.start;
    const end = weekRange.end;
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Get month range for month view
  const getMonthRange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the Monday of the week containing the first day
    const start = new Date(firstDay);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    // Get the Sunday of the week containing the last day
    const end = new Date(lastDay);
    const endDay = end.getDay();
    const diffEnd = end.getDate() + (7 - endDay);
    end.setDate(diffEnd);
    
    return { start, end, firstDay, lastDay };
  };

  const monthRange = useMemo(() => getMonthRange(currentDate), [currentDate]);

  // Filter courses based on selected filters and search
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Filter by cohorte
      if (selectedCohorte !== 'all' && course.cohort !== selectedCohorte) return false;
      
      // Filter by instructor
      if (selectedInstructor !== 'all' && course.instructor.toLowerCase() !== selectedInstructor.toLowerCase()) return false;
      
      // Filter by room
      if (selectedRoom !== 'all' && course.room !== selectedRoom) return false;
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const title = course.title?.toLowerCase() || '';
        const cohort = course.cohort?.toLowerCase() || '';
        const instructor = course.instructor?.toLowerCase() || '';
        const room = course.room?.toLowerCase() || '';
        
        if (!title.includes(search) && !cohort.includes(search) && !instructor.includes(search) && !room.includes(search)) {
          return false;
        }
      }
      
      return true;
    });
  }, [selectedCohorte, selectedInstructor, selectedRoom, searchTerm, courses]);

  // Generate time slots (8h to 20h, every 30 min)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Get courses for a specific day and time slot
  const getCoursesForSlot = (dayOfWeek: number, timeSlot: string) => {
    return filteredCourses.filter(course => {
      if (course.dayOfWeek !== dayOfWeek) return false;
      
      const [slotHour, slotMin] = timeSlot.split(':').map(Number);
      const slotMinutes = slotHour * 60 + slotMin;
      
      const [startHour, startMin] = course.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      
      const [endHour, endMin] = course.endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  };

  // Calculate course position and height in pixels
  const getCourseStyle = (course: CourseData, dayOfWeek: number) => {
    const [startHour, startMin] = course.startTime.split(':').map(Number);
    const [endHour, endMin] = course.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;
    
    // Each slot is 30px high (30 minutes)
    const slotHeight = 30;
    const startSlotIndex = Math.floor((startMinutes - (8 * 60)) / 30);
    const durationSlots = duration / 30;
    
    return {
      top: `${startSlotIndex * slotHeight}px`,
      height: `${durationSlots * slotHeight}px`,
    };
  };

  // Today's stats
  const todayStats = useMemo(() => {
    const today = new Date().getDay();
    const todayCourses = filteredCourses.filter(c => c.dayOfWeek === today);
    
    return {
      total: todayCourses.length,
      completed: todayCourses.filter(c => c.status === 'completed').length,
      ongoing: todayCourses.filter(c => c.status === 'ongoing').length,
      planned: todayCourses.filter(c => c.status === 'planned').length,
      alerts: filteredCourses.filter(c => c.status === 'cancelled').length,
    };
  }, [filteredCourses]);

  // Current time line position
  const getCurrentTimeLinePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes < 8 * 60 || totalMinutes > 20 * 60) return null;
    
    const percent = ((totalMinutes - (8 * 60)) / (12 * 60)) * 100;
    return percent;
  };

  const currentTimeLinePosition = getCurrentTimeLinePosition();

  const allDaysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const daysOfWeek = showWeekends ? allDaysOfWeek : allDaysOfWeek.slice(0, 5); // Monday to Friday
  const todayDay = new Date().getDay();
  const todayIndex = todayDay === 0 ? 6 : todayDay - 1; // Convert Sunday to last position

  // Get current day courses for day view
  const getDayCourses = (date: Date) => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Sunday = 7
    return filteredCourses.filter(c => c.dayOfWeek === dayOfWeek);
  };

  // Get month days for month view
  const getMonthDays = () => {
    const days = [];
    const { start, end } = monthRange;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();
      
      // Filter weekends if showWeekends is false
      if (!showWeekends && (dayOfWeek === 6 || dayOfWeek === 7)) {
        current.setDate(current.getDate() + 1);
        continue;
      }
      
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Memoize month days for month view
  const monthDays = useMemo(() => getMonthDays(), [showWeekends, currentDate, monthRange]);

  // Handle drag selection start (for new course creation)
  const handleMouseDown = (dayOfWeek: number, timeSlot: string, e: React.MouseEvent) => {
    // Prevent drag if clicking on a course (will be handled by course drag)
    if ((e.target as HTMLElement).closest('.course-block')) {
      return;
    }
    
    // Prevent drag if already dragging a course
    if (isDraggingCourse) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setSelectionStart({ dayOfWeek, timeSlot });
    setSelectionEnd({ dayOfWeek, timeSlot });
  };

  // Handle course drag start
  const handleCourseDragStart = (course: CourseData, e: React.MouseEvent, type: 'move' | 'resize-top' | 'resize-bottom') => {
    e.stopPropagation();
    e.preventDefault();
    
    const [hour, minute] = course.startTime.split(':').map(Number);
    const startSlot = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
    
    setIsDraggingCourse(true);
    setDraggedCourse(course);
    setDragType(type);
    setDragStartPosition({
      dayOfWeek: course.dayOfWeek,
      timeSlot: startSlot,
      mouseY: e.clientY,
    });
    setDragCurrentPosition({
      dayOfWeek: course.dayOfWeek,
      timeSlot: startSlot,
    });
  };

  // Handle course drag move
  const handleCourseDragMove = (dayOfWeek: number, timeSlot: string, e: React.MouseEvent) => {
    if (!isDraggingCourse || !draggedCourse || !dragStartPosition || !dragType) {
      return;
    }

    setDragCurrentPosition({ dayOfWeek, timeSlot });
  };

  // Handle course drag end
  const handleCourseDragEnd = () => {
    if (!isDraggingCourse || !draggedCourse || !dragStartPosition || !dragCurrentPosition || !dragType) {
      return;
    }

    const course = draggedCourse;
    const [originalStartHour, originalStartMin] = course.startTime.split(':').map(Number);
    const [originalEndHour, originalEndMin] = course.endTime.split(':').map(Number);
    const originalStartMinutes = originalStartHour * 60 + originalStartMin;
    const originalEndMinutes = originalEndHour * 60 + originalEndMin;
    const originalDuration = originalEndMinutes - originalStartMinutes;

    const [startSlotHour, startSlotMin] = dragStartPosition.timeSlot.split(':').map(Number);
    const [currentSlotHour, currentSlotMin] = dragCurrentPosition.timeSlot.split(':').map(Number);
    const startSlotMinutes = startSlotHour * 60 + startSlotMin;
    const currentSlotMinutes = currentSlotHour * 60 + currentSlotMin;
    const dragDeltaMinutes = currentSlotMinutes - startSlotMinutes;

    let newStartMinutes = originalStartMinutes;
    let newEndMinutes = originalEndMinutes;
    let newDayOfWeek = course.dayOfWeek;

    if (dragType === 'move') {
      // Move: déplacer tout le cours
      newStartMinutes = originalStartMinutes + dragDeltaMinutes;
      newEndMinutes = originalEndMinutes + dragDeltaMinutes;
      newDayOfWeek = dragCurrentPosition.dayOfWeek;
    } else if (dragType === 'resize-top') {
      // Resize top: changer l'heure de début
      newStartMinutes = originalStartMinutes + dragDeltaMinutes;
      // Ne pas permettre de redimensionner au-delà de la fin
      if (newStartMinutes >= originalEndMinutes) {
        newStartMinutes = originalEndMinutes - 30; // Minimum 30 minutes
      }
      newDayOfWeek = dragCurrentPosition.dayOfWeek;
    } else if (dragType === 'resize-bottom') {
      // Resize bottom: changer l'heure de fin
      newEndMinutes = originalEndMinutes + dragDeltaMinutes;
      // Ne pas permettre de redimensionner en dessous du début
      if (newEndMinutes <= originalStartMinutes) {
        newEndMinutes = originalStartMinutes + 30; // Minimum 30 minutes
      }
    }

    // Convert back to time strings
    const newStartHour = Math.floor(newStartMinutes / 60);
    const newStartMin = newStartMinutes % 60;
    const newEndHour = Math.floor(newEndMinutes / 60);
    const newEndMin = newEndMinutes % 60;

    const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMin.toString().padStart(2, '0')}`;
    const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;

    // Check if there's actually a change
    const hasChanged = 
      newDayOfWeek !== course.dayOfWeek ||
      newStartTime !== course.startTime ||
      newEndTime !== course.endTime;

    if (hasChanged) {
      setCourseUpdateData({
        course,
        newDayOfWeek,
        newStartTime,
        newEndTime,
      });
      setShowUpdateConfirmModal(true);
    }

    // Reset drag state
    setIsDraggingCourse(false);
    setDraggedCourse(null);
    setDragType(null);
    setDragStartPosition(null);
    setDragCurrentPosition(null);
  };

  // Handle drag selection update
  const handleMouseMove = (dayOfWeek: number, timeSlot: string) => {
    if (isDragging && selectionStart) {
      setSelectionEnd({ dayOfWeek, timeSlot });
    }
  };

  // Handle drag selection end
  const handleMouseUp = () => {
    if (isDragging && selectionStart && selectionEnd) {
      // Calculate start and end times
      const startSlot = selectionStart.timeSlot;
      const endSlot = selectionEnd.timeSlot;
      
      // If same day, calculate duration
      if (selectionStart.dayOfWeek === selectionEnd.dayOfWeek) {
        const [startHour, startMin] = startSlot.split(':').map(Number);
        const [endHour, endMin] = endSlot.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        // Ensure end is after start (swap if needed)
        const finalStart = startMinutes < endMinutes ? startSlot : endSlot;
        const finalEnd = startMinutes < endMinutes ? endSlot : startSlot;
        
        setNewCourseData({
          dayOfWeek: selectionStart.dayOfWeek,
          startTime: finalStart,
          endTime: finalEnd || `${(endHour + 1).toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
        });
        setShowCreateModal(true);
      }
      
      setIsDragging(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  // Calculate drag indicator line position (for course dragging)
  const getDragIndicatorLine = (dayOfWeek: number, timeSlot: string) => {
    if (!isDraggingCourse || !draggedCourse || !dragStartPosition || !dragCurrentPosition || !dragType) {
      return null;
    }

    // Only show indicator for move and resize-top operations
    if (dragType !== 'move' && dragType !== 'resize-top') {
      return null;
    }

    // Only show indicator on the day being dragged to
    if (dayOfWeek !== dragCurrentPosition.dayOfWeek) {
      return null;
    }

    const course = draggedCourse;
    const [originalStartHour, originalStartMin] = course.startTime.split(':').map(Number);
    const originalStartMinutes = originalStartHour * 60 + originalStartMin;

    const [startSlotHour, startSlotMin] = dragStartPosition.timeSlot.split(':').map(Number);
    const [currentSlotHour, currentSlotMin] = dragCurrentPosition.timeSlot.split(':').map(Number);
    const startSlotMinutes = startSlotHour * 60 + startSlotMin;
    const currentSlotMinutes = currentSlotHour * 60 + currentSlotMin;
    const dragDeltaMinutes = currentSlotMinutes - startSlotMinutes;

    let newStartMinutes = originalStartMinutes;
    
    if (dragType === 'move') {
      newStartMinutes = originalStartMinutes + dragDeltaMinutes;
    } else if (dragType === 'resize-top') {
      newStartMinutes = originalStartMinutes + dragDeltaMinutes;
      const [originalEndHour, originalEndMin] = course.endTime.split(':').map(Number);
      const originalEndMinutes = originalEndHour * 60 + originalEndMin;
      if (newStartMinutes >= originalEndMinutes) {
        newStartMinutes = originalEndMinutes - 30;
      }
    }

    // Check if this timeSlot matches the new start time
    const [slotHour, slotMin] = timeSlot.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMin;
    
    // Show indicator line at the new start position
    // The line should appear at the top of the slot where the new start time falls
    if (slotMinutes === Math.floor(newStartMinutes / 30) * 30) {
      // Calculate the exact position within this slot (0 = top of slot, 1 = bottom)
      const minutesInSlot = newStartMinutes % 30;
      const positionInSlot = minutesInSlot / 30;
      
      return {
        position: 'absolute' as const,
        left: '0',
        right: '0',
        top: `${positionInSlot * 100}%`,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #ec4899, transparent)',
        boxShadow: '0 0 10px rgba(236, 72, 153, 1), 0 0 20px rgba(236, 72, 153, 0.5)',
        zIndex: 25,
        pointerEvents: 'none' as const,
      };
    }

    return null;
  };

  // Calculate selection preview style
  const getSelectionStyle = (dayOfWeek: number, timeSlot: string) => {
    if (!isDragging || !selectionStart || !selectionEnd) return null;
    
    // Only show selection if same day
    if (selectionStart.dayOfWeek !== selectionEnd.dayOfWeek || dayOfWeek !== selectionStart.dayOfWeek) {
      return null;
    }
    
    // Check if this cell is in the selection
    const [slotHour, slotMin] = timeSlot.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMin;
    
    const [startHour, startMin] = selectionStart.timeSlot.split(':').map(Number);
    const [endHour, endMin] = selectionEnd.timeSlot.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const minTime = Math.min(startMinutes, endMinutes);
    const maxTime = Math.max(startMinutes, endMinutes);
    
    // Only show selection on the first slot
    if (slotMinutes === minTime) {
      const duration = maxTime - minTime;
      const slotHeight = 30;
      const durationSlots = Math.max(Math.ceil(duration / 30), 1);
      
      return {
        position: 'absolute' as const,
        left: '2px',
        right: '2px',
        top: '0px',
        height: `${durationSlots * slotHeight}px`,
        background: 'rgba(236, 72, 153, 0.3)',
        border: '2px dashed rgba(236, 72, 153, 0.8)',
        borderRadius: '4px',
        zIndex: 5,
        pointerEvents: 'none' as const,
      };
    }
    
    // Show highlight on all slots in selection
    if (slotMinutes >= minTime && slotMinutes < maxTime) {
      return {
        position: 'absolute' as const,
        left: '2px',
        right: '2px',
        top: '0px',
        height: '30px',
        background: 'rgba(236, 72, 153, 0.2)',
        border: '1px dashed rgba(236, 72, 153, 0.4)',
        borderRadius: '2px',
        zIndex: 4,
        pointerEvents: 'none' as const,
      };
    }
    
    return null;
  };

  // Render Day View
  const renderDayView = () => {
    const dayCourses = getDayCourses(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr] border-b border-[rgba(61,155,255,0.3)]">
            <div className="p-2"></div>
            <div className={cn(
              "p-4 text-center font-bold border-l border-[rgba(61,155,255,0.2)]",
              isToday && "bg-[rgba(61,155,255,0.1)]"
            )}>
              <div className="text-[#87ceeb] text-base">
                {allDaysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
              </div>
              <div className={cn(
                "text-sm mt-1",
                isToday ? "text-[#3d9bff]" : "text-[rgba(135,206,235,0.7)]"
              )}>
                {currentDate.getDate()} {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][currentDate.getMonth()]}
              </div>
            </div>
          </div>

          {/* Time slots */}
          <div className="relative">
            {currentTimeLinePosition !== null && (
              <div
                className="absolute left-0 right-0 z-20 pointer-events-none"
                style={{
                  top: `${currentTimeLinePosition}%`,
                  height: '2px',
                  background: '#ef4444',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                }}
              >
                <div
                  className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-red-500"
                  style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' }}
                />
              </div>
            )}

            {timeSlots.map((timeSlot) => {
              const [hour, minute] = timeSlot.split(':').map(Number);
              const isHour = minute === 0;
              const slotMinutes = hour * 60 + minute;
              
              const courses = dayCourses.filter(course => {
                const [startHour, startMin] = course.startTime.split(':').map(Number);
                const startMinutes = startHour * 60 + startMin;
                const [endHour, endMin] = course.endTime.split(':').map(Number);
                const endMinutes = endHour * 60 + endMin;
                return slotMinutes >= startMinutes && slotMinutes < endMinutes;
              });

              return (
                <div 
                  key={timeSlot} 
                  className="grid grid-cols-[60px_1fr] border-b border-[rgba(61,155,255,0.15)]"
                >
                  <div className="p-2 text-xs text-[rgba(135,206,235,0.6)] text-right pr-4 border-r border-[rgba(61,155,255,0.2)]">
                    {isHour && timeSlot}
                  </div>
                  <div
                    className="relative border-l border-[rgba(61,155,255,0.15)] min-h-[30px] h-[30px]"
                    onMouseDown={(e) => {
                      if (!isDraggingCourse) {
                        const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
                        handleMouseDown(dayOfWeek, timeSlot, e);
                      }
                    }}
                    onMouseMove={(e) => {
                      const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
                      if (isDraggingCourse && draggedCourse) {
                        handleCourseDragMove(dayOfWeek, timeSlot, e);
                      } else if (!isDraggingCourse && isDragging) {
                        handleMouseMove(dayOfWeek, timeSlot);
                      }
                    }}
                    onMouseUp={(e) => {
                      if (isDraggingCourse) {
                        handleCourseDragEnd();
                      } else if (isDragging) {
                        handleMouseUp();
                      }
                    }}
                    onDoubleClick={() => {
                      const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
                      const [hour, minute] = timeSlot.split(':').map(Number);
                      const endHour = hour + 1;
                      setNewCourseData({
                        dayOfWeek,
                        startTime: timeSlot,
                        endTime: `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                      });
                      setShowCreateModal(true);
                    }}
                    style={{ cursor: isDragging ? 'crosshair' : 'default' }}
                  >
                    {(() => {
                      const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
                      const selectionStyle = getSelectionStyle(dayOfWeek, timeSlot);
                      const dragIndicatorLine = getDragIndicatorLine(dayOfWeek, timeSlot);
                      return (
                        <>
                          {selectionStyle && <div style={selectionStyle} />}
                          {dragIndicatorLine && <div style={dragIndicatorLine} />}
                        </>
                      );
                    })()}
                    {courses.map((course) => {
                      const [startHour, startMin] = course.startTime.split(':').map(Number);
                      const courseStartMinutes = startHour * 60 + startMin;
                      
                      if (slotMinutes !== courseStartMinutes) return null;
                      
                      const courseStyle = getCourseStyle(course, 1);
                      
                      return (
                        <div
                          key={course.id}
                          style={{
                            position: 'absolute',
                            left: '4px',
                            right: '4px',
                            ...courseStyle,
                            zIndex: 10,
                          }}
                        >
                          <CourseBlock
                            course={course}
                            onClick={setSelectedCourse}
                            onDragStart={handleCourseDragStart}
                            isDragging={isDraggingCourse && draggedCourse?.id === course.id}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div 
            className="grid border-b border-[rgba(61,155,255,0.3)]"
            style={{
              gridTemplateColumns: `60px repeat(${daysOfWeek.length}, 1fr)`,
            }}
          >
            <div className="p-2"></div>
            {daysOfWeek.map((day, index) => {
              const dayDate = new Date(weekRange.start);
              dayDate.setDate(weekRange.start.getDate() + index);
              const actualDayIndex = showWeekends ? index : index;
              const isToday = actualDayIndex === todayIndex && 
                             todayIndex < daysOfWeek.length &&
                             weekRange.start <= new Date() && 
                             weekRange.end >= new Date();
              
              return (
                <div
                  key={day}
                  className={cn(
                    "p-3 text-center font-bold border-l border-[rgba(61,155,255,0.2)]",
                    isToday && "bg-[rgba(61,155,255,0.1)]"
                  )}
                >
                  <div className="text-[#87ceeb] text-sm">{day}</div>
                  <div className={cn(
                    "text-xs mt-1",
                    isToday ? "text-[#3d9bff]" : "text-[rgba(135,206,235,0.7)]"
                  )}>
                    {dayDate.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots grid */}
          <div className="relative">
            {currentTimeLinePosition !== null && (
              <div
                className="absolute left-0 right-0 z-20 pointer-events-none"
                style={{
                  top: `${currentTimeLinePosition}%`,
                  height: '2px',
                  background: '#ef4444',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                }}
              >
                <div
                  className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-red-500"
                  style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)' }}
                />
              </div>
            )}

            {timeSlots.map((timeSlot) => {
              const [hour, minute] = timeSlot.split(':').map(Number);
              const isHour = minute === 0;
              
              return (
                <div 
                  key={timeSlot} 
                  className="grid border-b border-[rgba(61,155,255,0.15)]"
                  style={{
                    gridTemplateColumns: `60px repeat(${daysOfWeek.length}, 1fr)`,
                  }}
                >
                  <div className="p-2 text-xs text-[rgba(135,206,235,0.6)] text-right pr-4 border-r border-[rgba(61,155,255,0.2)]">
                    {isHour && timeSlot}
                  </div>

                  {daysOfWeek.map((day, dayIndex) => {
                    const dayOfWeek = dayIndex + 1;
                    const courses = getCoursesForSlot(dayOfWeek, timeSlot);
                    const isWeekend = (day === 'Sam' || day === 'Dim');
                    const selectionStyle = getSelectionStyle(dayOfWeek, timeSlot);
                    
                    return (
                      <div
                        key={`${day}-${timeSlot}`}
                        className={cn(
                          "relative border-l border-[rgba(61,155,255,0.15)] min-h-[30px] h-[30px]",
                          isWeekend && "bg-[rgba(61,155,255,0.03)]"
                        )}
                        onMouseDown={(e) => {
                          if (!isDraggingCourse) {
                            handleMouseDown(dayOfWeek, timeSlot, e);
                          }
                        }}
                        onMouseMove={(e) => {
                          if (isDraggingCourse && draggedCourse) {
                            handleCourseDragMove(dayOfWeek, timeSlot, e);
                          } else if (!isDraggingCourse && isDragging) {
                            handleMouseMove(dayOfWeek, timeSlot);
                          }
                        }}
                        onMouseUp={(e) => {
                          if (isDraggingCourse) {
                            handleCourseDragEnd();
                          } else if (isDragging) {
                            handleMouseUp();
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          const [hour, minute] = timeSlot.split(':').map(Number);
                          const endHour = hour + 1;
                          setNewCourseData({
                            dayOfWeek,
                            startTime: timeSlot,
                            endTime: `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                          });
                          setShowCreateModal(true);
                        }}
                        style={{ cursor: isDragging ? 'crosshair' : 'default' }}
                      >
                        {selectionStyle && (
                          <div style={selectionStyle} />
                        )}
                        {courses.map((course) => {
                          const [startHour, startMin] = course.startTime.split(':').map(Number);
                          const courseStartMinutes = startHour * 60 + startMin;
                          const slotMinutes = hour * 60 + minute;
                          
                          if (slotMinutes !== courseStartMinutes) return null;
                          
                          const courseStyle = getCourseStyle(course, dayOfWeek);
                          
                          return (
                            <div
                              key={course.id}
                              style={{
                                position: 'absolute',
                                left: '4px',
                                right: '4px',
                                ...courseStyle,
                                zIndex: 10,
                              }}
                            >
                              <CourseBlock
                                course={course}
                                onClick={setSelectedCourse}
                                onDragStart={handleCourseDragStart}
                                isDragging={isDraggingCourse && draggedCourse?.id === course.id}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const allWeekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekDays = showWeekends ? allWeekDays : allWeekDays.slice(0, 5);
    const colsCount = showWeekends ? 7 : 5;
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Week days header */}
          <div 
            className="grid border-b border-[rgba(61,155,255,0.3)]"
            style={{ gridTemplateColumns: `repeat(${colsCount}, 1fr)` }}
          >
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center font-bold text-[#87ceeb] text-sm border-l border-[rgba(61,155,255,0.2)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div 
            className="grid"
            style={{ gridTemplateColumns: `repeat(${colsCount}, 1fr)` }}
          >
            {monthDays.map((date, index) => {
              const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
              
              const dayCourses = filteredCourses.filter(c => {
                // Match courses for this day of week
                return c.dayOfWeek === dayOfWeek;
              });
              const isToday = date.toDateString() === new Date().toDateString();
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-2 border-b border-l border-[rgba(61,155,255,0.15)]",
                    isToday && "bg-[rgba(61,155,255,0.05)]",
                    !isCurrentMonth && "opacity-40"
                  )}
                >
                  <div className={cn(
                    "text-xs font-bold mb-1",
                    isToday ? "text-[#3d9bff]" : "text-[rgba(135,206,235,0.7)]"
                  )}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="text-xs p-1 rounded cursor-pointer bg-[rgba(61,155,255,0.2)] text-[#87ceeb] border border-[rgba(61,155,255,0.3)] hover:bg-[rgba(61,155,255,0.3)]"
                        style={{
                          fontFamily: "'League Spartan', sans-serif",
                        }}
                      >
                        {course.startTime} - {course.title}
                      </div>
                    ))}
                    {dayCourses.length > 3 && (
                      <div className="text-xs text-[rgba(135,206,235,0.6)]">
                        +{dayCourses.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1600px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col items-start gap-4 flex-1 w-full">
          <h1 
            className="text-3xl font-black tracking-[0.15em] uppercase mb-0"
            style={{
              background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))',
            }}
          >
            Planning
          </h1>

          {/* Today's Stats - Just below Planning title */}
          <Card 
            style={{ 
              background: 'rgba(0,0,0,0.7)',
              border: '2px solid rgba(236, 72, 153, 0.6)',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.3), 0 0 15px rgba(236, 72, 153, 0.2) inset',
              borderRadius: '12px',
              width: 'fit-content',
              maxWidth: '100%',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <CardContent className="p-8">
              <div className="flex flex-wrap items-center" style={{ gap: '1.5rem' }}>
                <span 
                  className="font-bold text-[#3d9bff]"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    letterSpacing: '0.08em',
                    textShadow: '0 0 12px rgba(61,155,255,0.5)',
                    fontSize: '1.3rem',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                >
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <div 
                  style={{
                    width: '1px',
                    height: '2rem',
                    background: 'rgba(135,206,235,0.2)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                />
                <span 
                  className="font-bold text-[#87ceeb]"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    letterSpacing: '0.05em',
                    fontSize: '1.2rem',
                    textShadow: '0 0 10px rgba(135,206,235,0.5)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                >
                  {todayStats.total} cours planifiés
                </span>
                <div 
                  style={{
                    width: '1px',
                    height: '2rem',
                    background: 'rgba(135,206,235,0.2)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                />
                <span 
                  className="font-bold text-green-400 flex items-center gap-2"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    letterSpacing: '0.05em',
                    fontSize: '1.2rem',
                    textShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                >
                  {todayStats.completed} terminés <Check className="h-5 w-5" />
                </span>
                {todayStats.ongoing > 0 && (
                  <>
                    <div 
                      style={{
                        width: '1px',
                        height: '2rem',
                        background: 'rgba(135,206,235,0.2)',
                        marginLeft: '2rem',
                        marginRight: '2rem',
                      }}
                    />
                    <span 
                      className="font-bold text-orange-400"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: '0.05em',
                        fontSize: '1.2rem',
                        textShadow: '0 0 10px rgba(251, 146, 60, 0.5)',
                        marginLeft: '2rem',
                        marginRight: '2rem',
                      }}
                    >
                      {todayStats.ongoing} en cours
                    </span>
                  </>
                )}
                <div 
                  style={{
                    width: '1px',
                    height: '2rem',
                    background: 'rgba(135,206,235,0.2)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                />
                <span 
                  className="font-bold text-blue-400"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    letterSpacing: '0.05em',
                    fontSize: '1.2rem',
                    textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                    marginLeft: '0.75rem',
                    marginRight: '0.75rem',
                  }}
                >
                  {todayStats.planned} à venir
                </span>
                {todayStats.alerts > 0 && (
                  <>
                    <div 
                      style={{
                        width: '1px',
                        height: '2rem',
                        background: 'rgba(135,206,235,0.2)',
                        marginLeft: '2rem',
                        marginRight: '2rem',
                      }}
                    />
                    <span 
                      className="font-bold text-red-400 flex items-center gap-2"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: '0.05em',
                        fontSize: '1.2rem',
                        textShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                        marginLeft: '2rem',
                        marginRight: '2rem',
                      }}
                    >
                      <AlertCircle className="h-5 w-5" style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' }} />
                      {todayStats.alerts} alertes
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              size="lg"
              className="Add-button mb-0"
              onClick={() => {
                // Open create modal with default values
                const defaultDay = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = Math.floor(now.getMinutes() / 30) * 30;
                const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                const endHour = currentHour + 1;
                const endTime = `${endHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                
                setNewCourseData({
                  dayOfWeek: defaultDay,
                  startTime,
                  endTime,
                });
                setShowCreateModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nouveau cours
            </Button>
          </div>
        </div>

        {/* View Toggle Card with Today Button - Positioned to the right with neon style */}
        <Card 
          className="flex-shrink-0"
          style={{ 
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid rgba(61,155,255,0.5)',
            boxShadow: '0 0 25px rgba(61, 155, 255, 0.3), 0 0 15px rgba(61, 155, 255, 0.2) inset',
            borderRadius: '12px',
          }}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Today Button */}
              <Button
                variant="ghost"
                size="lg"
                onClick={goToToday}
                className="px-4 py-2 text-sm font-bold uppercase transition-all duration-200"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: '0.08em',
                  borderRadius: '8px',
                  background: 'rgba(61,155,255,0.15)',
                  border: '1px solid rgba(61,155,255,0.4)',
                  color: '#3d9bff',
                  boxShadow: '0 0 12px rgba(61,155,255,0.3)',
                  textShadow: '0 0 6px rgba(61,155,255,0.5)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.25)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 18px rgba(61,155,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.15)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(61,155,255,0.3)';
                }}
              >
                Aujourd'hui
              </Button>

              {/* Separator */}
              <div style={{ width: '1px', height: '2rem', background: 'rgba(61,155,255,0.3)' }} />

              {/* View Toggle */}
              <div className="flex gap-1">
                {(['month', 'week', 'day'] as ViewType[]).map((viewType) => (
                  <Button
                    key={viewType}
                    variant="ghost"
                    size="lg"
                    onClick={() => setView(viewType)}
                    className={cn(
                      "px-4 py-2 text-sm font-bold uppercase transition-all duration-200 relative",
                      view === viewType 
                        ? "bg-[rgba(61,155,255,0.3)] text-[#3d9bff]" 
                        : "text-[rgba(135,206,235,0.7)] hover:text-[#87ceeb] hover:bg-[rgba(61,155,255,0.15)]"
                    )}
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      letterSpacing: '0.08em',
                      borderRadius: '8px',
                      border: view === viewType ? '1px solid #3d9bff' : '1px solid transparent',
                      boxShadow: view === viewType ? '0 0 15px rgba(61,155,255,0.5), 0 0 8px rgba(61,155,255,0.3)' : 'none',
                      textShadow: view === viewType ? '0 0 8px rgba(61,155,255,0.6)' : 'none',
                    }}
                  >
                    {viewType === 'month' ? 'Mois' : viewType === 'week' ? 'Semaine' : 'Jour'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Date Navigation */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <Card 
          style={{ 
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid rgba(61,155,255,0.5)',
            boxShadow: '0 0 25px rgba(61, 155, 255, 0.3), 0 0 15px rgba(61, 155, 255, 0.2) inset',
            borderRadius: '12px',
            flex: '1',
            minWidth: '400px',
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={
                  view === 'day' ? goToPreviousDay :
                  view === 'month' ? goToPreviousMonth :
                  goToPreviousWeek
                }
                className="p-3"
                style={{
                  background: 'rgba(61,155,255,0.1)',
                  border: '1px solid rgba(61,155,255,0.3)',
                  color: '#3d9bff',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.2)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(61,155,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div 
                className="text-lg font-bold text-[#3d9bff] text-center flex-1"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: '0.08em',
                  textShadow: '0 0 10px rgba(61,155,255,0.5)',
                  padding: '0.75rem 1rem',
                }}
              >
                {view === 'day' ? (() => {
                  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                  return `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                })() :
                view === 'month' ? (() => {
                  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                  return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                })() :
                formatDateRange()}
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={
                  view === 'day' ? goToNextDay :
                  view === 'month' ? goToNextMonth :
                  goToNextWeek
                }
                className="p-3"
                style={{
                  background: 'rgba(61,155,255,0.1)',
                  border: '1px solid rgba(61,155,255,0.3)',
                  color: '#3d9bff',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.2)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(61,155,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(61,155,255,0.1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card 
          style={{ 
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid rgba(61,155,255,0.5)',
            boxShadow: '0 0 25px rgba(61, 155, 255, 0.3), 0 0 15px rgba(61, 155, 255, 0.2) inset',
            borderRadius: '12px',
            flexShrink: 0,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#3d9bff]" style={{ filter: 'drop-shadow(0 0 8px rgba(61,155,255,0.6))' }} />
              <input
                type="date"
                value={currentDate.toISOString().split('T')[0]}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
                className="px-4 py-3 rounded-lg bg-[rgba(0,0,0,0.3)] border-2 border-[rgba(61,155,255,0.4)] text-[#87ceeb] text-base font-bold"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 12px rgba(61,155,255,0.2)',
                  minWidth: '180px',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#3d9bff';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 18px rgba(61,155,255,0.4)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(61,155,255,0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(61,155,255,0.2)';
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Card */}
      <SearchFiltersCard
        title="Recherche et filtres"
        searchValue={searchTerm}
        searchPlaceholder="Nom du cours, cohorte, intervenant, salle..."
        onSearchChange={setSearchTerm}
        filters={useMemo<FilterConfig[]>(() => [
          {
            id: 'cohorte',
            label: 'Cohorte',
            placeholder: 'Toutes les cohortes',
            value: selectedCohorte === 'all' ? undefined : selectedCohorte,
            options: cohorts.filter(c => c.id !== 'all').map((cohort) => ({
              value: cohort.id,
              label: cohort.name,
            })),
            onValueChange: (v) => setSelectedCohorte(v || 'all'),
          },
          {
            id: 'intervenant',
            label: 'Intervenant',
            placeholder: 'Tous les intervenants',
            value: selectedInstructor === 'all' ? undefined : selectedInstructor,
            options: instructors.filter(i => i.id !== 'all').map((instructor) => ({
              value: instructor.id,
              label: instructor.name,
            })),
            onValueChange: (v) => setSelectedInstructor(v || 'all'),
          },
          {
            id: 'salle',
            label: 'Salle',
            placeholder: 'Toutes les salles',
            value: selectedRoom === 'all' ? undefined : selectedRoom,
            options: rooms.filter(r => r.id !== 'all').map((room) => ({
              value: room.id,
              label: room.name,
            })),
            onValueChange: (v) => setSelectedRoom(v || 'all'),
          },
        ], [selectedCohorte, selectedInstructor, selectedRoom])}
        resultCount={filteredCourses.length}
        resultLabel="cours"
      />

      {/* Weekend Toggle */}
      <Card 
        className="mb-4"
        style={{ 
          background: 'rgba(0,0,0,0.7)',
          border: '2px solid rgba(61,155,255,0.5)',
          boxShadow: '0 0 25px rgba(61, 155, 255, 0.3), 0 0 15px rgba(61, 155, 255, 0.2) inset',
          borderRadius: '12px',
        }}
      >
        <CardContent className="p-4">
          <label 
            className="neon-toggle flex items-center gap-3 cursor-pointer"
            style={{ 
              fontFamily: "'League Spartan', sans-serif",
            }}
          >
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
              aria-label={showWeekends ? 'Masquer les weekends' : 'Afficher les weekends'}
            />
            <span className="switch">
              <span className="knob" />
            </span>
            <span 
              className="font-bold uppercase text-[#87ceeb]"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
              }}
            >
              Afficher les weekends
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Calendar Grid - Conditional rendering based on view */}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}

      {/* Course Detail Popover */}
      {selectedCourse && (
        <div
          className="fixed z-50 bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(61,155,255,0.5)] rounded-lg shadow-xl p-4 min-w-[300px]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-[#87ceeb]">{selectedCourse.title}</h3>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-[rgba(135,206,235,0.6)] hover:text-[#87ceeb]"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="text-[#87ceeb]">
              <span className="opacity-70">Intervenant :</span> {selectedCourse.instructor}
            </div>
            <div className="text-[#87ceeb]">
              <span className="opacity-70">Cohorte :</span> {selectedCourse.cohort} ({selectedCourse.studentsCount} étudiants)
            </div>
            <div className="text-[#87ceeb]">
              <span className="opacity-70">Salle :</span> {selectedCourse.room}
            </div>
            <div className="text-[#87ceeb]">
              <span className="opacity-70">Horaire :</span> {selectedCourse.startTime} - {selectedCourse.endTime}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                // TODO: Open attendance
                setSelectedCourse(null);
              }}
            >
              Faire l'appel
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                // TODO: Edit course
                setSelectedCourse(null);
              }}
            >
              Modifier
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // TODO: Duplicate course
                setSelectedCourse(null);
              }}
            >
              Dupliquer
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                // TODO: Cancel course
                setSelectedCourse(null);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSelectedCourse(null)}
        />
      )}

      {/* Create Course Modal */}
      {showCreateModal && newCourseData && (
        <div
          className="fixed z-50 bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(61,155,255,0.5)] rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 30px rgba(61, 155, 255, 0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 
            className="text-xl font-bold mb-4 text-[#87ceeb]"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              textShadow: '0 0 10px rgba(135,206,235,0.5)',
            }}
          >
            Créer un nouveau cours
          </h2>
          
          <div className="space-y-4">
            {/* Day */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Jour
              </Label>
              <div 
                className="p-3 rounded-md border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {allDaysOfWeek[newCourseData.dayOfWeek - 1]}
              </div>
            </div>

            {/* Start Time */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Heure de début
              </Label>
              <input
                type="time"
                value={newCourseData.startTime}
                onChange={(e) => setNewCourseData({ ...newCourseData, startTime: e.target.value })}
                className="w-full p-3 rounded-md border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              />
            </div>

            {/* End Time */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Heure de fin
              </Label>
              <input
                type="time"
                value={newCourseData.endTime}
                onChange={(e) => setNewCourseData({ ...newCourseData, endTime: e.target.value })}
                className="w-full p-3 rounded-md border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              />
            </div>

            {/* Title */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Titre du cours
              </Label>
              <input
                type="text"
                placeholder="Ex: Marketing Digital"
                value={createFormData.title}
                onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                className="w-full p-3 rounded-md border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb] placeholder:text-[rgba(135,206,235,0.5)]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              />
            </div>

            {/* Cohort */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Cohorte
              </Label>
              <Select value={createFormData.cohortId} onValueChange={(value) => setCreateFormData({ ...createFormData, cohortId: value })}>
                <SelectTrigger className="border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]">
                  <SelectValue placeholder="Sélectionner une cohorte" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(61,155,255,0.5)]">
                  {cohorts.filter(c => c.id !== 'all').map((cohort) => (
                    <SelectItem key={cohort.id} value={cohort.id} className="text-[#87ceeb]">
                      {cohort.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructor */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Intervenant
              </Label>
              <Select value={createFormData.instructorId} onValueChange={(value) => setCreateFormData({ ...createFormData, instructorId: value })}>
                <SelectTrigger className="border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]">
                  <SelectValue placeholder="Sélectionner un intervenant" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(61,155,255,0.5)]">
                  {instructors.filter(i => i.id !== 'all').map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id} className="text-[#87ceeb]">
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Salle
              </Label>
              <Select value={createFormData.roomId} onValueChange={(value) => setCreateFormData({ ...createFormData, roomId: value })}>
                <SelectTrigger className="border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]">
                  <SelectValue placeholder="Sélectionner une salle" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(61,155,255,0.5)]">
                  {rooms.filter(r => r.id !== 'all').map((room) => (
                    <SelectItem key={room.id} value={room.id} className="text-[#87ceeb]">
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                if (!newCourseData || !createFormData.title || !createFormData.cohortId || !createFormData.instructorId || !createFormData.roomId) {
                  // TODO: Show error message
                  return;
                }
                
                // Find cohort, instructor, and room data
                const cohort = cohorts.find(c => c.id === createFormData.cohortId);
                const instructor = instructors.find(i => i.id === createFormData.instructorId);
                const room = rooms.find(r => r.id === createFormData.roomId);
                
                if (!cohort || !instructor || !room) {
                  return;
                }
                
                // Determine cohort color based on cohort name
                const cohortColor = cohort.name.includes('BTS') ? 'blue' : cohort.name.includes('BACHELOR') ? 'green' : 'purple';
                
                // Create new course
                const newCourse: CourseData = {
                  id: `course-${Date.now()}`,
                  title: createFormData.title,
                  cohort: cohort.name,
                  cohortColor: cohortColor,
                  room: room.name,
                  instructor: instructor.name,
                  startTime: newCourseData.startTime,
                  endTime: newCourseData.endTime,
                  dayOfWeek: newCourseData.dayOfWeek,
                  attendanceDone: false,
                  studentsCount: 25,
                  status: 'planned',
                };
                
                // Add course to list
                setCourses(prev => [...prev, newCourse]);
                
                // Reset form and close modal
                setShowCreateModal(false);
                setNewCourseData(null);
                setCreateFormData({
                  title: '',
                  cohortId: '',
                  instructorId: '',
                  roomId: '',
                });
              }}
              className={styles['card-button-primary']}
            >
              Créer le cours
            </Button>
            <Button
              onClick={() => {
                setShowCreateModal(false);
                setNewCourseData(null);
                setCreateFormData({
                  title: '',
                  cohortId: '',
                  instructorId: '',
                  roomId: '',
                });
              }}
              className={styles['card-button-secondary']}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Overlay for Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => {
            setShowCreateModal(false);
            setNewCourseData(null);
            setCreateFormData({
              title: '',
              cohortId: '',
              instructorId: '',
              roomId: '',
            });
          }}
        />
      )}

      {/* Update Course Confirmation Modal */}
      {showUpdateConfirmModal && courseUpdateData && (
        <div
          className="fixed z-50 bg-[rgba(0,0,0,0.95)] border-2 border-[rgba(236,72,153,0.5)] rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 
            className="text-xl font-bold mb-4 text-[#ec4899]"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              textShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
            }}
          >
            Confirmer la modification du cours
          </h2>
          
          <div className="space-y-4 mb-6">
            {/* Course Title */}
            <div>
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Cours
              </Label>
              <div 
                className="p-3 rounded-md border-2 border-[rgba(61,155,255,0.5)] bg-[rgba(0,0,0,0.5)] text-[#87ceeb]"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                {courseUpdateData.course.title}
              </div>
            </div>

            {/* Changes Summary */}
            <div className="space-y-2">
              <Label className="text-[#87ceeb] mb-2 block" style={{ fontFamily: "'League Spartan', sans-serif" }}>
                Modifications :
              </Label>
              
              {/* Day Change */}
              {courseUpdateData.course.dayOfWeek !== courseUpdateData.newDayOfWeek && (
                <div className="p-3 rounded-md border-2 border-[rgba(236,72,153,0.5)] bg-[rgba(236,72,153,0.1)]">
                  <div className="text-sm text-[#ec4899] font-bold mb-1">Jour :</div>
                  <div className="text-[#87ceeb]">
                    {allDaysOfWeek[courseUpdateData.course.dayOfWeek - 1]} → {allDaysOfWeek[courseUpdateData.newDayOfWeek - 1]}
                  </div>
                </div>
              )}
              
              {/* Time Changes */}
              {(courseUpdateData.course.startTime !== courseUpdateData.newStartTime || 
                courseUpdateData.course.endTime !== courseUpdateData.newEndTime) && (
                <div className="p-3 rounded-md border-2 border-[rgba(236,72,153,0.5)] bg-[rgba(236,72,153,0.1)]">
                  <div className="text-sm text-[#ec4899] font-bold mb-1">Horaire :</div>
                  <div className="text-[#87ceeb]">
                    {courseUpdateData.course.startTime} - {courseUpdateData.course.endTime} → {courseUpdateData.newStartTime} - {courseUpdateData.newEndTime}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (!courseUpdateData) return;
                
                // Update the course in the list
                setCourses(prev => prev.map(course => {
                  if (course.id === courseUpdateData.course.id) {
                    return {
                      ...course,
                      dayOfWeek: courseUpdateData.newDayOfWeek,
                      startTime: courseUpdateData.newStartTime,
                      endTime: courseUpdateData.newEndTime,
                    };
                  }
                  return course;
                }));
                
                // Close modal and reset
                setShowUpdateConfirmModal(false);
                setCourseUpdateData(null);
              }}
              className={styles['card-button-primary']}
            >
              Confirmer la modification
            </Button>
            <Button
              onClick={() => {
                setShowUpdateConfirmModal(false);
                setCourseUpdateData(null);
              }}
              className={styles['card-button-secondary']}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Overlay for Update Confirm Modal */}
      {showUpdateConfirmModal && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => {
            setShowUpdateConfirmModal(false);
            setCourseUpdateData(null);
          }}
        />
      )}
    </div>
  );
};

export default PlanningPage;

