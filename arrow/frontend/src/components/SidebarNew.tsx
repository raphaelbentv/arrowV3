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
    { title: 'Dashboard', icon: <LayoutDashboard />, path: '/admin/dashboard', role: ['admin'] },
    { title: 'Cohortes', icon: <GraduationCap />, path: '/admin/cohortes', role: ['admin'] },
    { title: 'Étudiants', icon: <Users />, path: '/admin/students', role: ['admin'] },
    { title: 'Intervenants', icon: <Users />, path: '/admin/intervenant-list', role: ['admin'] },
    { title: 'Planning', icon: <Calendar />, path: '/admin/planning', role: ['admin', 'intervenant'] },
    { title: 'Présences', icon: <ClipboardCheck />, path: '/admin/presences', role: ['admin', 'intervenant'] },
    { title: 'Évaluations', icon: <BarChart3 />, path: '/admin/evaluations', role: ['admin', 'intervenant'] },
    { title: 'Paramètres', icon: <Settings />, path: '/admin/settings', role: ['admin', 'intervenant'] },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (!item.role) return true;
    return user && user.role && item.role.includes(user.role);
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-black/85 backdrop-blur-sm border-r-[3px] border-[#3d9bff]/30 transition-all duration-300 z-50 ${
        open ? 'w-[280px]' : 'w-[70px]'
      } sm:block hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(61,155,255,0.2)]">
        {open && (
          <h2 className="text-xl font-bold text-vaporwave text-glow">ARROW</h2>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-[rgba(61,155,255,0.1)] transition-colors"
        >
          {open ? <ChevronLeft className="w-5 h-5 text-[#87ceeb]" /> : <Menu className="w-5 h-5 text-[#87ceeb]" />}
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
                  ? 'bg-[rgba(61,155,255,0.2)] text-[#3d9bff] border border-[#3d9bff] shadow-[0_0_15px_rgba(61,155,255,0.3)]'
                  : 'text-white/70 hover:bg-[rgba(61,155,255,0.1)] hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {open && <span className="font-medium">{item.title}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(61,155,255,0.2)]">
        {open && user && (
          <div className="mb-4 px-4 py-2 bg-[rgba(61,155,255,0.05)] border border-[rgba(61,155,255,0.2)] rounded-lg">
            <p className="text-sm text-white font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-[#87ceeb]">{user.email}</p>
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
