import React, { useEffect, useMemo, useState } from 'react';
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
  Search,
  User as UserIcon,
  X,
} from 'lucide-react';
import styles from './ui/navbar.module.css';
import { cn } from '@/lib/utils';

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

interface AdminNavProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

// Configuration de navigation pour admin
const adminNavConfig = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Pédagogie', href: '/admin/cohortes', icon: GraduationCap,
    children: [
      { label: 'Cohortes', href: '/admin/cohortes' },
      { label: 'Modules', href: '/admin/modules' },
      { label: 'Étudiants', href: '/admin/students' },
      { label: 'Évaluations', href: '/admin/evaluations' },
      { label: 'Présences', href: '/admin/calls' },
      { label: 'Calendrier', href: '/admin/planning' },
    ],
  },
  {
    label: 'Utilisateurs', href: '/admin/intervenant-list', icon: Users,
    children: [
      { label: 'Intervenants', href: '/admin/intervenant-list' },
      { label: 'Administrateurs', href: '/admin/administrators' },
    ],
  },
  {
    label: 'Paramètres', href: '/admin/settings', icon: Settings,
    children: [
      { label: 'Mon profil', href: '/admin/settings' },
      { label: 'École', href: '/admin/settings/ecole' },
      { label: 'Système', href: '/admin/settings/systeme' },
      { label: 'Aide', href: '/admin/settings/aide' },
    ],
  },
];

// Configuration des groupes pour la sidebar
const sidebarGroups: MenuGroup[] = [
  {
    header: 'Dashboard',
    items: [
      { title: 'Dashboard', icon: <LayoutDashboard />, path: '/admin/dashboard', role: ['admin'] },
    ],
  },
  {
    header: 'Pédagogie',
    items: [
      { title: 'Cohortes', icon: <GraduationCap />, path: '/admin/cohortes', role: ['admin'] },
      { title: 'Modules', icon: <GraduationCap />, path: '/admin/modules', role: ['admin'] },
      { title: 'Étudiants', icon: <Users />, path: '/admin/students', role: ['admin'] },
      { title: 'Évaluations', icon: <BarChart3 />, path: '/admin/evaluations', role: ['admin'] },
      { title: 'Présences', icon: <ClipboardCheck />, path: '/admin/calls', role: ['admin'] },
      { title: 'Calendrier', icon: <Calendar />, path: '/admin/planning', role: ['admin'] },
    ],
  },
  {
    header: 'Utilisateurs',
    items: [
      { title: 'Intervenants', icon: <Users />, path: '/admin/intervenant-list', role: ['admin'] },
      { title: 'Administrateurs', icon: <Users />, path: '/admin/administrators', role: ['admin'] },
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

export const AdminNav: React.FC<AdminNavProps> = ({
  showSearch = false,
  searchPlaceholder = 'Rechercher...',
  onSearch,
}) => {
  // États pour la navbar horizontale
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});
  const [showProfile, setShowProfile] = useState(false);
  const neonPalette = useMemo(() => ['#00FFD1', '#FF1CF7', '#3B82F6', '#A3FF12', '#C084FC'], []);
  const [neonColor, setNeonColor] = useState(neonPalette[0]);
  
  // États pour la sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!location.pathname) return;
    const random = neonPalette[Math.floor(Math.random() * neonPalette.length)];
    setNeonColor(random);
  }, [location.pathname, neonPalette]);

  const isAdminPath = location.pathname.startsWith('/admin');
  const filteredGroups = sidebarGroups.map((group) => ({
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

  const activeLink = location.pathname;
  const navItems = adminNavConfig;

  return (
    <>
      {/* Navbar horizontale en haut */}
      <nav className={styles.navbar}>
        <div className={styles.scanlines} />
        <div className={styles.container}>
          <a href="/admin/dashboard" className={cn('group', styles.logo)}>
            <span className={cn(styles.logoLink, styles.logoText)}>ARROW</span>
            <span className={styles.roleBadge}>ADMIN</span>
            <div className={styles.logoGlow} />
          </a>

          {showSearch && (
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                className={styles.searchInput}
              />
            </div>
          )}

          {/* Groupe menu desktop + icône profil alignés à droite */}
          <div className={styles.desktopOnly}>
            <div className={styles.desktopMenu}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeLink === item.href;
                return (
                  <div key={item.href} className={styles.navItemWrapper}>
                    <a
                      href={item.href}
                      className={cn('group px-4 py-2 text-[15px] font-medium hover:text-gray-100', styles.navLink, isActive ? styles.navLinkActive : styles.navLinkInactive)}
                      style={isActive ? { color: neonColor, textShadow: `0 0 8px ${neonColor}, 0 0 16px ${neonColor}` } : { color: 'rgb(229 231 235)' }}
                    >
                      <div className={styles.iconContainer}>
                        <IconComponent className={styles.icon} />
                        <div className={styles.iconGlow} />
                      </div>
                      <span className={styles.navLabel}>{item.label}</span>
                      <span className={styles.underline} />
                      <div className={styles.particle} />
                    </a>
                    {item.children && item.children.length > 0 && (
                      <div className={styles.dropdown}>
                        {item.children.map((child) => (
                          <a key={child.href} href={child.href} className={styles.dropdownItem}>
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              aria-label="Statut de connexion"
              onClick={() => setShowProfile(!showProfile)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '2px solid rgba(61, 155, 255, 0.4)',
                background: 'rgba(61, 155, 255, 0.08)',
                boxShadow: `0 0 18px ${neonColor}55`,
                transition: 'transform 0.2s ease',
              }}
            >
              <UserIcon size={18} style={{ color: neonColor, filter: 'drop-shadow(0 0 8px currentColor)' }} />
            </button>
            {showProfile && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  minWidth: '220px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(61,155,255,0.35)',
                  boxShadow: `0 10px 30px ${neonColor}44, inset 0 0 20px ${neonColor}22`,
                  color: '#d1d5db',
                  zIndex: 60,
                }}
              >
                <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#87ceeb' }}>Profil</div>
                <div style={{ marginTop: '6px', fontWeight: 700, color: '#e5e7eb' }}>
                  {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Utilisateur'}
                </div>
                {user?.email && (
                  <div style={{ marginTop: '2px', fontSize: '12px', color: '#9ca3af' }}>{user.email}</div>
                )}
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  Statut: <span style={{ color: isAuthenticated ? '#22c55e' : '#ef4444' }}>{isAuthenticated ? 'Connecté' : 'Déconnecté'}</span>
                </div>
                <a
                  href="/admin/settings"
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: 'block',
                    marginTop: '12px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '2px solid rgba(61,155,255,0.4)',
                    background: 'rgba(61,155,255,0.08)',
                    color: '#87ceeb',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(61,155,255,0.35)',
                    textAlign: 'center'
                  }}
                >
                  Modifier mon profil
                </a>
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '2px solid rgba(220,38,38,0.4)',
                    background: 'rgba(220,38,38,0.08)',
                    color: '#ff6b6b',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(220,38,38,0.35)',
                  }}
                >
                  Se déconnecter
                </button>
              </div>
            )}
            </div>
          </div>

          <div className={styles.mobileOnly} style={{ alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
            <button
              aria-label="Statut de connexion"
              onClick={() => setShowProfile(!showProfile)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '2px solid rgba(61, 155, 255, 0.4)',
                background: 'rgba(61, 155, 255, 0.08)',
                boxShadow: `0 0 16px ${neonColor}55`,
              }}
            >
              <UserIcon size={16} style={{ color: neonColor, filter: 'drop-shadow(0 0 8px currentColor)' }} />
            </button>

            {showProfile && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: '48px',
                  minWidth: '200px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(61,155,255,0.35)',
                  boxShadow: `0 10px 30px ${neonColor}44, inset 0 0 20px ${neonColor}22`,
                  color: '#d1d5db',
                  zIndex: 60,
                }}
              >
                <div style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#87ceeb' }}>Profil</div>
                <div style={{ marginTop: '6px', fontWeight: 700, color: '#e5e7eb' }}>
                  {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Utilisateur'}
                </div>
                {user?.email && (
                  <div style={{ marginTop: '2px', fontSize: '12px', color: '#9ca3af' }}>{user.email}</div>
                )}
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  Statut: <span style={{ color: isAuthenticated ? '#22c55e' : '#ef4444' }}>{isAuthenticated ? 'Connecté' : 'Déconnecté'}</span>
                </div>
                <a
                  href="/admin/settings"
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: 'block',
                    marginTop: '12px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '2px solid rgba(61,155,255,0.4)',
                    background: 'rgba(61,155,255,0.08)',
                    color: '#87ceeb',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(61,155,255,0.35)',
                    textAlign: 'center'
                  }}
                >
                  Modifier mon profil
                </a>
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '2px solid rgba(220,38,38,0.4)',
                    background: 'rgba(220,38,38,0.08)',
                    color: '#ff6b6b',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    boxShadow: '0 0 12px rgba(220,38,38,0.35)',
                  }}
                >
                  Se déconnecter
                </button>
              </div>
            )}

            <button
              aria-label={navbarOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className={styles.mobileBurger}
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              {navbarOpen ? (
                <X className={cn(styles.burgerIcon, styles.burgerIconRotated)} />
              ) : (
                <Menu className={styles.burgerIcon} />
              )}
              <div className={styles.burgerGlow} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {navbarOpen && (
          <div className={cn('md:hidden', styles.mobileDrawer)}>
            <div className={styles.mobileScanlines} />
            {showSearch && (
              <div className={styles.mobileSearchContainer}>
                <Search size={20} className={styles.mobileSearchIcon} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                  }}
                  className={styles.mobileSearchInput}
                />
              </div>
            )}
            <div className={styles.mobileMenuList}>
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const hasChildren = !!item.children?.length;
                const expanded = expandedMobile[item.label] ?? false;
                if (hasChildren) {
                  return (
                    <div key={item.href} style={{ animationDelay: `${index * 50}ms` }}>
                      <button
                        className={cn('group', styles.mobileNavItem)}
                        onClick={() => setExpandedMobile((prev) => ({ ...prev, [item.label]: !expanded }))}
                      >
                        <div className={styles.mobileNavItemBg} />
                        <div className={styles.iconOctagon}>
                          <IconComponent className={styles.mobileIcon} />
                        </div>
                        <span className={styles.mobileNavLabel}>{item.label}</span>
                        <span className={styles.mobileArrow} style={{ transform: expanded ? 'rotate(90deg) translateX(8px)' : undefined }}>→</span>
                        <div className={styles.mobileUnderline} />
                      </button>
                      {expanded && (
                        <div className={styles.mobileSubmenu}>
                          {item.children!.map((child) => (
                            <a
                              key={child.href}
                              href={child.href}
                              className={styles.mobileSubmenuItem}
                              onClick={() => setNavbarOpen(false)}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn('group', styles.mobileNavItem)}
                    onClick={() => setNavbarOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={styles.mobileNavItemBg} />
                    <div className={styles.iconOctagon}>
                      <IconComponent className={styles.mobileIcon} />
                    </div>
                    <span className={styles.mobileNavLabel}>{item.label}</span>
                    <span className={styles.mobileArrow}>→</span>
                    <div className={styles.mobileUnderline} />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar latérale */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-black/85 backdrop-blur-sm border-r-[3px] border-[#3d9bff]/30 transition-all duration-300 z-50 sm:block hidden',
          sidebarOpen ? 'w-[280px]' : 'w-[70px]'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(61,155,255,0.2)]">
          {sidebarOpen && (
            <h2 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #3d9bff, #87ceeb, #5dbaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(61, 155, 255, 0.6))',
              }}
            >
              ARROW
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[rgba(61,155,255,0.1)] transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-[#87ceeb]" /> : <Menu className="w-5 h-5 text-[#87ceeb]" />}
          </button>
        </div>

        <nav className="p-2 space-y-0.5">
          {filteredGroups.map((group) => {
            const expanded = expandedGroups[group.header] ?? true;
            return (
              <div key={group.header}>
                <button
                  onClick={() => toggleGroup(group.header)}
                  className="w-full flex items-center justify-between px-2 pt-2 pb-0.5 text-xs font-bold tracking-widest text-white/60 hover:text-white/90"
                >
                  <span>{group.header}</span>
                  <span className={cn('transition-transform', expanded ? 'rotate-0' : '-rotate-90')}>❯</span>
                </button>
                {expanded && (
                  <div className="mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = item.path && location.pathname === item.path;
                      return (
                        <button
                          key={item.title}
                          onClick={() => item.path && navigate(item.path)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-1 rounded-lg transition-all',
                            isActive
                              ? 'bg-[rgba(61,155,255,0.2)] text-[#3d9bff] border border-[#3d9bff] shadow-[0_0_15px_rgba(61,155,255,0.3)]'
                              : item.path
                                ? 'text-white/70 hover:bg-[rgba(61,155,255,0.1)] hover:text-white'
                                : 'text-white/40 cursor-default'
                          )}
                          disabled={!item.path}
                        >
                          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                          {sidebarOpen && <span className="font-medium">{item.title}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(61,155,255,0.2)]">
          {sidebarOpen && user && (
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
            {sidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminNav;

