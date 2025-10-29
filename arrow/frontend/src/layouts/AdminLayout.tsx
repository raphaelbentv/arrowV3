import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Navbar } from '../components/ui/Navbar';
import { 
  Bell,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email || 'Admin';

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Navbar sans barre de recherche */}
      <Navbar 
        role="admin"
        logoHref="/admin/dashboard"
        activeLink={window.location.pathname}
        showSearch={false}
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

      {/* Contenu principal */}
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
