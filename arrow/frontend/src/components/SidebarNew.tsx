import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 70;

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  role?: string[];
}

const SidebarNew: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard />, path: '/admin', role: ['admin'] },
    { title: 'Cohortes', icon: <GraduationCap />, path: '/admin/cohortes', role: ['admin'] },
    { title: 'Étudiants', icon: <Users />, path: '/admin/etudiants', role: ['admin'] },
    { title: 'Intervenants', icon: <Users />, path: '/admin/intervenant-list', role: ['admin'] },
    { title: 'Planning', icon: <Calendar />, path: '/admin/planning', role: ['admin', 'intervenant'] },
    { title: 'Présences', icon: <ClipboardCheck />, path: '/admin/presences', role: ['admin', 'intervenant'] },
    { title: 'Évaluations', icon: <BarChart3 />, path: '/admin/evaluations', role: ['admin', 'intervenant'] },
    { title: 'Paramètres', icon: <Settings />, path: '/admin/settings', role: ['admin', 'intervenant'] },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (!item.role) return true;
    return user && item.role.includes(user.role);
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-vaporwave-darker border-r border-vaporwave transition-all duration-300 z-50 ${
        open ? 'w-[280px]' : 'w-[70px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-vaporwave">
        {open && (
          <h2 className="text-xl font-bold text-vaporwave text-glow">ARROW</h2>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-vaporwave-dark transition-colors"
        >
          {open ? <ChevronLeft className="w-5 h-5 text-vaporwave" /> : <Menu className="w-5 h-5 text-vaporwave" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-vaporwave-blue/20 text-vaporwave-blue border border-vaporwave-blue'
                  : 'text-white/70 hover:bg-vaporwave-dark hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {open && <span className="font-medium">{item.title}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-vaporwave">
        {open && user && (
          <div className="mb-4 px-4 py-2 bg-vaporwave-dark rounded-lg">
            <p className="text-sm text-white font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-vaporwave-sky">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {open && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarNew;

