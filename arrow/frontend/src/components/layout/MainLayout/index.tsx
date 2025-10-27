import { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Menu,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Détecter le changement de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };

  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      text: 'Intervenants',
      icon: Users,
      path: '/admin/intervenant-list'
    }
  ];

  const settingsMenuItems = [
    {
      text: 'Administrateurs',
      icon: Shield,
      path: '/admin/administrator-list'
    }
  ];

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const isPathActive = (path: string) => location.pathname === path;

  const MenuItem = ({ item }: { item: typeof mainMenuItems[0] }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          if (isMobile) handleDrawerToggle();
        }}
        className={`w-full flex items-center px-4 py-3 text-white hover:bg-white/10 transition-colors ${
          isPathActive(item.path) ? 'bg-white/15 border-l-4 border-[#FFD700]' : ''
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{item.text}</span>
      </button>
    );
  };

  const drawer = (
    <div className="flex flex-col h-full text-white overflow-auto">
      <div className="h-16" /> {/* Espace pour le header */}
      <nav className="flex-1">
        {mainMenuItems.map((item) => (
          <MenuItem key={item.text} item={item} />
        ))}
        <Separator className="my-1 bg-white/12" />
        <div>
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              <span>Paramètres</span>
            </div>
            {settingsOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div className={`overflow-hidden transition-all ${settingsOpen ? 'max-h-96' : 'max-h-0'}`}>
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) handleDrawerToggle();
                  }}
                  className={`w-full flex items-center pl-8 py-3 hover:bg-white/10 transition-colors ${
                    isPathActive(item.path) ? 'bg-white/15 border-l-4 border-[#FFD700]' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span>{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="flex-grow" />
      <Separator className="bg-white/12" />
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span>Déconnexion</span>
      </button>
    </div>
  );

  return (
    <div className="flex">
      {/* AppBar fixe */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#252525] z-50 flex items-center px-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDrawerToggle}
            className="mr-2 text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-xl font-bold text-[#FFD700]">ArroW</h1>
      </header>

      {/* Drawer pour mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleDrawerToggle}
        >
          <div 
            className="fixed left-0 top-0 h-full w-60 bg-[#252525] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {drawer}
          </div>
        </div>
      )}

      {/* Drawer pour desktop */}
      {!isMobile && (
        <aside className="w-60 flex-shrink-0 h-screen sticky top-0 bg-[#252525]">
          {drawer}
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 min-h-screen" style={{ 
        marginLeft: !isMobile ? '0' : '0',
        width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`
      }}>
        <div className="h-16" />
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 