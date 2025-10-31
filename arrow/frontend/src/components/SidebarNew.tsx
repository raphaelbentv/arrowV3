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

interface MenuLeafItem {
  title: string;
  icon?: React.ReactElement;
  path?: string;
  role?: string[];
}

interface MenuGroup {
  header: string;
  items: MenuLeafItem[];
}

const SidebarNew: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const groups: MenuGroup[] = [
    {
      header: 'Dashboard',
      items: [
        { title: 'Dashboard', icon: <LayoutDashboard />, path: '/admin/dashboard', role: ['admin'] },
      ],
    },
    {
      header: 'Users',
      items: [
        { title: 'Étudiants', icon: <Users />, path: '/admin/students', role: ['admin'] },
        { title: 'Intervenants', icon: <Users />, path: '/admin/intervenant-list', role: ['admin'] },
        { title: 'Administrateurs', icon: <Users />, path: '/admin/administrators', role: ['admin'] },
      ],
    },
    {
      header: 'Pédagogie',
      items: [
        { title: 'Cohortes', icon: <GraduationCap />, path: '/admin/cohortes', role: ['admin'] },
        { title: 'Modules', icon: <GraduationCap />, path: '/admin/modules', role: ['admin'] },
        { title: 'Évaluations', icon: <BarChart3 />, role: ['admin'] },
        { title: 'Présences', icon: <ClipboardCheck />, role: ['admin'] },
      ],
    },
    {
      header: 'Planning',
      items: [
        { title: 'Calendrier', icon: <Calendar />, path: '/admin/planning', role: ['admin'] },
      ],
    },
    {
      header: 'Paramètres',
      items: [
        { title: 'Mon profil', icon: <Settings />, path: '/admin/settings', role: ['admin', 'intervenant'] },
        { title: 'École', icon: <Settings />, path: '/admin/settings/ecole', role: ['admin'] },
        { title: 'Système', icon: <Settings />, path: '/admin/settings/systeme', role: ['admin'] },
        { title: 'Aide', icon: <Settings />, path: '/admin/settings/aide', role: ['admin'] },
      ],
    },
  ];

  const isAdminPath = location.pathname.startsWith('/admin');
  const filteredGroups = groups.map((group) => ({
    header: group.header,
    items: group.items.filter((item) => {
      if (!item.role) return true;
      if (isAdminPath && item.role.includes('admin')) return true;
      return user && user.role && item.role.includes(user.role);
    }),
  }));

  const toggleGroup = (header: string) => {
    setExpandedGroups((prev) => ({ ...prev, [header]: !(prev[header] ?? true) }));
  };

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
        {filteredGroups.map((group) => {
          const expanded = expandedGroups[group.header] ?? true;
          return (
            <div key={group.header}>
              <button
                onClick={() => toggleGroup(group.header)}
                className="w-full flex items-center justify-between px-4 pt-5 pb-2 text-xs font-bold tracking-widest text-white/60 hover:text-white/90"
              >
                <span>{group.header}</span>
                <span className={`transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}>❯</span>
              </button>
              {expanded && (
                <div className="mt-1 space-y-1">
                  {group.items.map((item) => {
                    const isActive = item.path && location.pathname === item.path;
                    return (
                      <button
                        key={item.title}
                        onClick={() => item.path && navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-[rgba(61,155,255,0.2)] text-[#3d9bff] border border-[#3d9bff] shadow-[0_0_15px_rgba(61,155,255,0.3)]'
                            : item.path
                              ? 'text-white/70 hover:bg-[rgba(61,155,255,0.1)] hover:text-white'
                              : 'text-white/40 cursor-default'
                        }`}
                        disabled={!item.path}
                      >
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        {open && <span className="font-medium">{item.title}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
