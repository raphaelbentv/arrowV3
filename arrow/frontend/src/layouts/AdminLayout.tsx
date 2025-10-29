import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Navbar } from '../components/ui/Navbar';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  UserCog, 
  BookOpen, 
  Phone, 
  Settings,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin/dashboard' },
    { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
    { icon: GraduationCap, label: 'Étudiants', href: '/admin/students' },
    { icon: UserCog, label: 'Intervenants', href: '/admin/intervenant-list' },
    { icon: BookOpen, label: 'Cohortes', href: '/admin/cohortes' },
    { icon: BookOpen, label: 'Cours / Matières', href: '/admin/courses' },
    { icon: Phone, label: 'Appels', href: '/admin/calls' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email || 'Admin';

  const handleSearch = (query: string) => {
    // Ici vous pouvez implémenter la logique de recherche globale
    console.log('Recherche globale:', query);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Navbar avec barre de recherche */}
      <Navbar 
        role="admin"
        logoHref="/admin/dashboard"
        activeLink={window.location.pathname}
        showSearch={true}
        searchPlaceholder="Rechercher..."
        onSearch={handleSearch}
      />
      
      {/* Header avec infos utilisateur et actions */}
      <header 
        className="sticky top-[4.5rem] z-40 backdrop-blur-xl"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          borderBottom: '2px solid rgba(61, 155, 255, 0.2)',
          marginBottom: '1.5rem',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          {/* Menu mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden transition-colors p-2 rounded-lg"
            style={{ color: '#87ceeb' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Actions du header */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Nom et rôle */}
            <div className="hidden md:flex flex-col items-end">
              <span 
                className="text-sm font-bold uppercase tracking-[0.1em]"
                style={{ color: '#3d9bff' }}
              >
                Admin
              </span>
              <span 
                className="text-xs uppercase tracking-[0.15em]"
                style={{ color: '#87ceeb' }}
              >
                {userName}
              </span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: '#87ceeb',
                background: 'rgba(61, 155, 255, 0.1)',
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
            borderImage: 'linear-gradient(180deg, #3d9bff, #87ceeb) 1',
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
                              background: 'linear-gradient(90deg, rgba(61, 155, 255, 0.2), transparent)',
                              borderLeft: '4px solid #3d9bff',
                              color: '#3d9bff',
                            }
                          : {
                              color: 'rgba(135, 206, 235, 0.7)',
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

export default AdminLayout;
