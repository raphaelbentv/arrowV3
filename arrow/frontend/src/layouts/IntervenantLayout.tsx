import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface IntervenantLayoutProps {
  children: React.ReactNode;
}

const IntervenantLayout: React.FC<IntervenantLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/intervenant/dashboard' },
    { icon: BookOpen, label: 'Mes Cours', href: '/intervenant/cours' },
    { icon: Users, label: 'Étudiants', href: '/intervenant/etudiants' },
    { icon: Calendar, label: 'Planning', href: '/intervenant/planning' },
    { icon: FileText, label: 'Évaluations', href: '/intervenant/evaluations' },
    { icon: Settings, label: 'Paramètres', href: '/intervenant/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email || 'Intervenant';

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header fixe */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          borderBottom: '3px solid',
          borderImage: 'linear-gradient(90deg, #9C27B0, #BA68C8, #CE93D8, #9C27B0) 1',
          boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
          marginBottom: '1.5rem',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo et menu mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden transition-colors"
              style={{ color: '#CE93D8' }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <a 
              href="/intervenant/dashboard"
              className="text-3xl font-black tracking-[0.25em] uppercase transition-all hover:scale-110 duration-300"
              style={{
                background: 'linear-gradient(135deg, #9C27B0, #BA68C8, #CE93D8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(156, 39, 176, 0.6))',
              }}
            >
              ARROW
            </a>
          </div>

          {/* Actions du header */}
          <div className="flex items-center gap-6">
            {/* Nom et rôle */}
            <div className="hidden md:flex flex-col items-end">
              <span 
                className="text-sm font-bold uppercase tracking-[0.1em]"
                style={{ color: '#9C27B0' }}
              >
                Intervenant
              </span>
              <span 
                className="text-xs uppercase tracking-[0.15em]"
                style={{ color: '#CE93D8' }}
              >
                {userName}
              </span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: '#CE93D8',
                background: 'rgba(156, 39, 176, 0.1)',
              }}
            >
              <Bell size={20} />
              <span 
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ background: '#ff6b6b' }}
              />
            </button>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 font-bold uppercase tracking-[0.1em] text-xs"
              style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid rgba(220, 38, 38, 0.4)',
                color: '#ff6b6b',
              }}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto z-40
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            width: '280px',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRight: '2px solid',
            borderImage: 'linear-gradient(180deg, #9C27B0, #BA68C8) 1',
          }}
        >
          <nav className="p-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.href;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                        ${isActive ? '' : 'hover:translate-x-2'}
                      `}
                      style={
                        isActive
                          ? {
                              background: 'linear-gradient(90deg, rgba(156, 39, 176, 0.2), transparent)',
                              borderLeft: '4px solid #9C27B0',
                              color: '#9C27B0',
                            }
                          : {
                              color: 'rgba(206, 147, 216, 0.7)',
                            }
                      }
                    >
                      <Icon size={20} />
                      <span className="font-bold uppercase tracking-[0.1em] text-sm">
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenu principal */}
        <main 
          className="flex-1 min-h-screen"
          style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default IntervenantLayout;
