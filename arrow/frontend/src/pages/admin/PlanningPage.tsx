import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, MapPin, Search, X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CourseBlock } from './planning/CourseBlock';
import { coursesData, cohorts, instructors, rooms, CourseData } from './planning/mock-data';
import { cn } from '@/lib/utils';

type ViewType = 'widgets' | 'week' | 'month';

export const PlanningPage: React.FC = () => {
  const [view, setView] = useState<ViewType>('widgets');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [selectedCohorte, setSelectedCohorte] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWeekends, setShowWeekends] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [courses, setCourses] = useState<CourseData[]>(coursesData);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch = searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.cohort.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.room.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCohorte = selectedCohorte === 'all' || course.cohort === selectedCohorte;
      const matchInstructor = selectedInstructor === 'all' || course.instructor === selectedInstructor;
      const matchRoom = selectedRoom === 'all' || course.room === selectedRoom;

      return matchSearch && matchCohorte && matchInstructor && matchRoom;
    });
  }, [courses, searchTerm, selectedCohorte, selectedInstructor, selectedRoom]);

  // Navigation
  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateRange = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)} ${currentDate.getFullYear()}`;
  };

  const monthRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return { start, end };
  }, [currentDate]);

  // Get month days for month view (moved to top level to follow Rules of Hooks)
  const monthDays = useMemo(() => {
    const days = [];
    const { start, end } = monthRange;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();
      if (!showWeekends && (dayOfWeek === 6 || dayOfWeek === 7)) {
        current.setDate(current.getDate() + 1);
        continue;
      }
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [showWeekends, monthRange]);

  // Get badge class based on color
  const getBadgeClass = (cohortColor: string) => {
    const colorMap: Record<string, string> = {
      magenta: 'magenta',
      red: 'magenta',
      cyan: 'cyan',
      green: 'cyan',
      purple: 'blue',
    };
    return colorMap[cohortColor] || 'blue';
  };

  // Render Widgets View
  const renderWidgetsView = () => {
    const sortedCourses = [...filteredCourses].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

    const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const getDayName = (dayOfWeek: number) => {
      return dayLabels[dayOfWeek === 7 ? 6 : dayOfWeek - 1];
    };

    const formatTime = (start: string, end: string) => {
      return `${start.replace(':', 'h')} - ${end.replace(':', 'h')}`;
    };

    return (
      <div id="p-cal-widgets" className="calendar-view" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedCourses.map((course, index) => {
          const badgeClass = getBadgeClass(course.cohortColor);
          const dayName = getDayName(course.dayOfWeek);
          const isOngoing = course.status === 'ongoing';

          return (
            <Card
              key={course.id}
              className="card animate-slide-in"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
              onClick={() => setSelectedCourse(course)}
            >
              <CardContent className="p-0">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h2 style={{ margin: 0, fontFamily: 'var(--font-main)', textTransform: 'uppercase', letterSpacing: '0.18em', textShadow: '0 0 8px rgba(61,155,255,0.6)' }}>
                        {course.title}
                      </h2>
                      <span className={cn('badge', `badge-${badgeClass}`, isOngoing && 'animate-glow-pulse')}>
                        Cours
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#fff' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock className="icon-glow" style={{ width: '16px', height: '16px' }} />
                        {formatTime(course.startTime, course.endTime)}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin className="icon-glow" style={{ width: '16px', height: '16px' }} />
                        {course.room}
                      </span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{dayName}</span>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', opacity: 0.7 }}>
                      {course.instructor} • {course.studentsCount} étudiants
                    </div>
                  </div>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                    }}
                  >
                    Détails
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {sortedCourses.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#87ceeb', fontSize: '1.125rem', margin: 0 }}>Aucun cours trouvé</p>
            <p style={{ color: 'rgba(135,206,235,0.6)', fontSize: '0.875rem', marginTop: '8px', marginBottom: 0 }}>
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const allDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const days = showWeekends ? allDays : allDays.slice(0, 5);
    // Créneaux horaires de 8h à 20h (13 créneaux) pour emploi du temps scolaire
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <div className="calendar-view week" style={{ display: 'grid', gridTemplateColumns: `60px repeat(${days.length}, 1fr)`, gap: '12px' }}>
        <div />
        {days.map((day) => (
          <h3 key={day} style={{ margin: 0, textAlign: 'center', padding: '12px' }}>
            {day}
          </h3>
        ))}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            <div style={{ padding: '8px', fontSize: '0.75rem', color: 'rgba(135,206,235,0.7)', borderRight: '1px solid rgba(61,155,255,0.2)', borderBottom: '1px solid rgba(61,155,255,0.1)' }}>
              {hour}h
            </div>
            {days.map((_, dayIndex) => {
              const dayOfWeek = dayIndex + 1;
              const hourCourses = filteredCourses.filter(
                c => c.dayOfWeek === dayOfWeek && parseInt(c.startTime.split(':')[0]) === hour
              );
              return (
                <div
                  key={`${hour}-${dayIndex}`}
                  style={{ minHeight: '60px', position: 'relative', borderLeft: '1px solid rgba(61,155,255,0.1)', borderBottom: '1px solid rgba(61,155,255,0.1)' }}
                >
                  {hourCourses.map((course) => (
                    <CourseBlock
                      key={course.id}
                      course={course}
                      onClick={setSelectedCourse}
                    />
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const allWeekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekDays = showWeekends ? allWeekDays : allWeekDays.slice(0, 5);
    const colsCount = showWeekends ? 7 : 5;

    return (
      <div className="calendar-view month" style={{ display: 'grid', gridTemplateColumns: `repeat(${colsCount}, 1fr)`, gap: '6px' }}>
        {weekDays.map((day) => (
          <h3 key={day} style={{ margin: 0, textAlign: 'center', padding: '8px' }}>
            {day}
          </h3>
        ))}
        {monthDays.map((date, index) => {
          const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
          const dayCourses = filteredCourses.filter(c => c.dayOfWeek === dayOfWeek);
          const isToday = date.toDateString() === new Date().toDateString();
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={index}
              className="card"
              style={{
                minHeight: '100px',
                padding: '6px',
                opacity: !isCurrentMonth ? 0.4 : 1,
                backgroundColor: isToday ? 'rgba(61,155,255,0.05)' : 'transparent',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '3px', color: isToday ? '#3d9bff' : 'rgba(135,206,235,0.7)' }}>
                {date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {dayCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="badge badge-blue"
                    style={{ cursor: 'pointer', fontSize: '10px', padding: '2px 4px' }}
                  >
                    {course.startTime} - {course.title}
                  </div>
                ))}
                {dayCourses.length > 3 && (
                  <div style={{ fontSize: '0.75rem', color: 'rgba(135,206,235,0.6)' }}>
                    +{dayCourses.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        :root {
          --color-primary: #3d9bff;
          --color-secondary: #87ceeb;
          --color-tertiary: #5dbaff;
          --color-accent: #00ffaa;
          --color-magenta: #ec4899;
          --color-bg-dark: #0a0a0a;
          --color-bg-blue: #0a1a2f;
          --font-main: 'League Spartan', sans-serif;
        }

        /* Annuler le padding du main pour la page Planning */
        main:has(#planning-page),
        main.planning-page-main {
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
        }

        #planning-page {
          background: linear-gradient(135deg, var(--color-bg-dark), var(--color-bg-blue), rgba(61,155,255,0.15));
          color: #fff;
          font-family: var(--font-main);
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        #planning-page .retro-grid {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 45%;
          background-image: repeating-linear-gradient(0deg, rgba(61,155,255,0.2) 0, transparent 1px, transparent 40px);
          transform: perspective(500px) rotateX(60deg);
          animation: grid-move 20s linear infinite;
          pointer-events: none;
        }

        #planning-page .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 2px);
          opacity: 0.1;
          pointer-events: none;
        }

        @keyframes grid-move {
          0% { background-position-y: 0; }
          100% { background-position-y: 40px; }
        }

        #planning-page h1, #planning-page h2, #planning-page h3, #planning-page h4, #planning-page h5, #planning-page h6 {
          font-family: var(--font-main);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          text-shadow: 0 0 8px rgba(61,155,255,0.6);
        }

        #planning-page .card {
          background: rgba(0,0,0,0.65);
          border: 2px solid rgba(61,155,255,0.3);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        #planning-page .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 20px rgba(61,155,255,0.5);
        }

        #planning-page .badge {
          display: inline-block;
          border-radius: 9999px;
          text-transform: uppercase;
          font-size: 11px;
          padding: 2px 8px;
          border: 1px solid rgba(61,155,255,0.3);
          background: rgba(61,155,255,0.2);
          color: var(--color-secondary);
        }

        #planning-page .badge.magenta {
          border-color: rgba(236,72,153,0.4);
          color: var(--color-magenta);
          background: rgba(236,72,153,0.2);
        }

        #planning-page .badge.cyan {
          border-color: rgba(0,255,170,0.4);
          color: var(--color-accent);
          background: rgba(0,255,170,0.15);
        }

        #planning-page .badge.blue {
          border-color: rgba(61,155,255,0.4);
          color: var(--color-secondary);
          background: rgba(61,155,255,0.15);
        }

        #planning-page button.btn,
        #planning-page .btn {
          font-family: var(--font-main);
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 16px;
          border: 2px solid rgba(61,155,255,0.3);
          background: transparent;
          color: var(--color-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 44px;
          min-height: 44px;
        }

        #planning-page button.btn:hover,
        #planning-page .btn:hover {
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
          color: #000;
          box-shadow: 0 0 12px rgba(61,155,255,0.6);
        }

        #planning-page .calendar-toggle {
          display: flex;
          gap: 8px;
          background: rgba(10,26,47,0.6);
          border: 2px solid rgba(61,155,255,0.3);
          border-radius: 24px;
          padding: 4px;
        }

        #planning-page .calendar-view {
          display: grid;
          gap: 12px;
        }

        #planning-page .calendar-view.week {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        #planning-page .calendar-view.month {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        #planning-page .animate-glow-pulse {
          animation: glow-pulse 8s ease-in-out infinite;
        }

        #planning-page .icon-glow {
          filter: drop-shadow(0 0 6px rgba(61,155,255,0.6));
        }

        #planning-page .focus-visible:focus {
          outline: 2px solid var(--color-primary);
          box-shadow: 0 0 8px rgba(61,155,255,0.6);
        }

        #planning-page .container {
          max-width: 100%;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          #planning-page {
            font-size: clamp(0.9rem, 2vw, 1rem);
          }
          #planning-page .calendar-view.week,
          #planning-page .calendar-view.month {
            grid-template-columns: repeat(2, 1fr);
          }
          #planning-page .container {
            padding: 0;
          }
        }
      `}</style>

      <div id="planning-page">
        <div className="retro-grid" />
        <div className="scanlines" />

        <div className="container">
          {/* Header */}
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 id="p-title" style={{ margin: 0 }}>
                CALENDRIER
              </h1>
            </div>

            {/* View Toggle */}
            <div id="p-views" className="calendar-toggle" role="tablist" aria-label="Changer de vue">
              {[
                { key: 'widgets' as ViewType, label: 'Agenda' },
                { key: 'week' as ViewType, label: 'Semaine' },
                { key: 'month' as ViewType, label: 'Mois' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  id={`p-view-${opt.key}`}
                  role="tab"
                  aria-selected={view === opt.key}
                  onClick={() => setView(opt.key)}
                  className="btn focus-visible"
                  style={{
                    background: view === opt.key
                      ? 'transparent'
                      : 'transparent',
                    color: view === opt.key ? '#3d9bff' : 'var(--color-secondary)',
                    border: view === opt.key ? '2px solid #3d9bff' : '2px solid rgba(61,155,255,0.3)',
                    boxShadow: view === opt.key ? '0 0 12px rgba(61, 155, 255, 0.4), 0 0 24px rgba(61, 155, 255, 0.2)' : 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </header>

          {/* Enhanced Search Input + New Course Button */}
          <div className="card" style={{ marginTop: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px',
                marginBottom: '8px',
              }}
            >
              <Search
                className="icon-glow"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#3d9bff',
                  pointerEvents: 'none',
                  zIndex: 2,
                  filter: 'drop-shadow(0 0 8px rgba(61,155,255,0.8))',
                  transition: 'all 0.3s ease',
                }}
              />
              <input
                id="p-search-input"
                type="text"
                placeholder="Rechercher un cours, cohorte, intervenant, salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus-visible"
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 52px',
                  borderRadius: '16px',
                  background: 'rgba(10,26,47,0.6)',
                  border: '2px solid rgba(61,155,255,0.5)',
                  color: '#87ceeb',
                  fontFamily: 'var(--font-main)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 20px rgba(61,155,255,0.25) inset, 0 0 15px rgba(61,155,255,0.15), 0 4px 12px rgba(0,0,0,0.3)',
                  textShadow: '0 0 6px rgba(135,206,235,0.4)',
                  height: '52px',
                  boxSizing: 'border-box',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3d9bff';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(61,155,255,0.5) inset, 0 0 25px rgba(61,155,255,0.4), 0 6px 20px rgba(61,155,255,0.3)';
                  e.currentTarget.style.background = 'rgba(10,26,47,0.8)';
                  e.currentTarget.style.textShadow = '0 0 10px rgba(135,206,235,0.6)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(61,155,255,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(61,155,255,0.25) inset, 0 0 15px rgba(61,155,255,0.15), 0 4px 12px rgba(0,0,0,0.3)';
                  e.currentTarget.style.background = 'rgba(10,26,47,0.6)';
                  e.currentTarget.style.textShadow = '0 0 6px rgba(135,206,235,0.4)';
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(61,155,255,0.25)',
                    border: '2px solid rgba(61,155,255,0.6)',
                    borderRadius: '50%',
                    color: '#87ceeb',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 2,
                    boxShadow: '0 0 10px rgba(61,155,255,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(61,155,255,0.4)';
                    e.currentTarget.style.borderColor = '#3d9bff';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(61,155,255,0.6), 0 0 25px rgba(61,155,255,0.4)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(61,155,255,0.25)';
                    e.currentTarget.style.borderColor = 'rgba(61,155,255,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(61,155,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <X className="icon-glow" style={{ width: '16px', height: '16px', filter: 'drop-shadow(0 0 6px rgba(61,155,255,0.8))' }} />
                </button>
              )}
            </div>
            
            {/* Neon Separator */}
            <div
              style={{
                width: '2px',
                height: '32px',
                background: 'linear-gradient(180deg, transparent, rgba(61,155,255,0.6), transparent)',
                boxShadow: '0 0 8px rgba(61,155,255,0.4)',
              }}
            />
            
            {/* New Course Button */}
            <button
              id="p-new-btn"
              className="btn"
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '2px solid rgba(236,72,153,0.6)',
                color: '#ec4899',
                fontFamily: 'var(--font-main)',
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 12px rgba(236,72,153,0.2)',
                textShadow: '0 0 4px rgba(236,72,153,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ec4899';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(236,72,153,0.4)';
                e.currentTarget.style.background = 'rgba(236,72,153,0.1)';
                e.currentTarget.style.textShadow = '0 0 8px rgba(236,72,153,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(236,72,153,0.6)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(236,72,153,0.2)';
                e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                e.currentTarget.style.textShadow = '0 0 4px rgba(236,72,153,0.3)';
              }}
            >
              <Plus className="icon-glow" style={{ width: '18px', height: '18px' }} />
              Nouveau cours
            </button>
          </div>

          {/* Navigation */}
          <div className="card" style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                id="p-date-prev"
                className="btn"
                onClick={view === 'month' ? goToPreviousMonth : goToPreviousWeek}
                style={{ padding: '8px' }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <p
                id="p-date-display"
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-tertiary)',
                  textShadow: '0 0 8px rgba(61,155,255,0.4)',
                }}
              >
                {view === 'month'
                  ? currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                  : view === 'week'
                  ? formatDateRange()
                  : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
              <button
                id="p-date-next"
                className="btn"
                onClick={view === 'month' ? goToNextMonth : goToNextWeek}
                style={{ padding: '8px' }}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <Select value={selectedCohorte} onValueChange={setSelectedCohorte}>
              <SelectTrigger
                id="p-filter-cohorte-select"
                className="focus-visible"
                style={{ width: '180px', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}
              >
                <SelectValue placeholder="Cohorte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les cohortes</SelectItem>
                {cohorts.filter(c => c.id !== 'all').map((cohort) => (
                  <SelectItem key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
              <SelectTrigger
                id="p-filter-intervenant-select"
                className="focus-visible"
                style={{ width: '180px', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}
              >
                <SelectValue placeholder="Intervenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les intervenants</SelectItem>
                {instructors.filter(i => i.id !== 'all').map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger
                id="p-filter-salle-select"
                className="focus-visible"
                style={{ width: '180px', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#87ceeb' }}
              >
                <SelectValue placeholder="Salle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les salles</SelectItem>
                {rooms.filter(r => r.id !== 'all').map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Enhanced Weekend Toggle */}
            <label
              id="p-weekend-toggle"
              className="neon-toggle"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(10,26,47,0.4)',
                border: '2px solid rgba(61,155,255,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(61,155,255,0.5)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(61,155,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(61,155,255,0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <input
                id="p-weekend-toggle-input"
                type="checkbox"
                checked={showWeekends}
                onChange={(e) => setShowWeekends(e.target.checked)}
                aria-label={showWeekends ? 'Masquer les weekends' : 'Afficher les weekends'}
              />
              <span className="switch">
                <span className="knob" />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-main)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: showWeekends ? '#87ceeb' : 'rgba(135,206,235,0.6)',
                  textShadow: showWeekends ? '0 0 8px rgba(61,155,255,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                Weekends
              </span>
            </label>
          </div>

          {/* Calendar Grid */}
          <div id="p-calendar">
            {view === 'widgets' && <div id="p-cal-widgets">{renderWidgetsView()}</div>}
            {view === 'week' && <div id="p-cal-week">{renderWeekView()}</div>}
            {view === 'month' && <div id="p-cal-month">{renderMonthView()}</div>}
          </div>

          {/* Course Detail Popover */}
          {selectedCourse && (
            <>
              <div
                id="p-course-overlay"
                style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSelectedCourse(null)}
              />
              <div
                id="p-course-popover"
                className="card"
                style={{
                  position: 'fixed',
                  zIndex: 50,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '300px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>{selectedCourse.title}</h3>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn"
                    style={{ padding: '4px 8px', minWidth: 'auto', minHeight: 'auto' }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
                  <div>Intervenant : {selectedCourse.instructor}</div>
                  <div>Cohorte : {selectedCourse.cohort}</div>
                  <div>Salle : {selectedCourse.room}</div>
                  <div>Horaire : {selectedCourse.startTime} - {selectedCourse.endTime}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    id="p-course-call-btn"
                    className="btn"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Faire l'appel
                  </button>
                  <button
                    id="p-course-edit-btn"
                    className="btn"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanningPage;
