import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Home, LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, FileText, Settings, BarChart3, Search, UserCog, Phone, ShieldPlus, ClipboardCheck, User as UserIcon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import styles from './navbar.module.css';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/authContext';

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
}

interface NavbarProps {
  role?: 'admin' | 'intervenant' | 'student';
  logoHref?: string;
  activeLink?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

// Configuration de navigation par rôle
const navConfigs: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    {
      label: 'Users', href: '/admin/students', icon: Users,
      children: [
        { label: 'Étudiants', href: '/admin/students' },
        { label: 'Intervenants', href: '/admin/intervenant-list' },
        { label: 'Administrateurs', href: '/admin/administrators' },
      ],
    },
    {
      label: 'Pédagogie', href: '/admin/cohortes', icon: GraduationCap,
      children: [
        { label: 'Cohortes', href: '/admin/cohortes' },
        { label: 'Modules', href: '/admin/modules' },
        { label: 'Évaluations', href: '/admin/evaluations' },
        { label: 'Présences', href: '/admin/calls' },
      ],
    },
    {
      label: 'Planning', href: '/admin/planning', icon: Calendar,
      children: [
        { label: 'Calendrier', href: '/admin/planning' },
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
  ],
  intervenant: [
    { label: 'Tableau de bord', href: '/intervenant/dashboard', icon: Home },
    { label: 'Mes Cours', href: '/intervenant/cours', icon: BookOpen },
    { label: 'Étudiants', href: '/intervenant/etudiants', icon: Users },
    { label: 'Planning', href: '/intervenant/planning', icon: Calendar },
    { label: 'Évaluations', href: '/intervenant/evaluations', icon: FileText },
  ],
  student: [
    { label: 'Accueil', href: '/student/dashboard', icon: Home },
    { label: 'Mes Cours', href: '/student/cours', icon: BookOpen },
    { label: 'Planning', href: '/student/planning', icon: Calendar },
    { label: 'Notes', href: '/student/notes', icon: BarChart3 },
    { label: 'Profil', href: '/student/profil', icon: Settings },
  ],
};

export function Navbar({ role = 'admin', logoHref, activeLink, showSearch = false, searchPlaceholder = 'Rechercher...', onSearch }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});
  // Palette néon et couleur active stable par section
  const neonPalette = useMemo(() => ['#00FFD1', '#FF1CF7', '#3B82F6', '#A3FF12', '#C084FC'], []);
  const [neonColor, setNeonColor] = useState(neonPalette[0]);
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Choisir une couleur aléatoire à chaque changement d'onglet actif
    if (!activeLink) return;
    const random = neonPalette[Math.floor(Math.random() * neonPalette.length)];
    setNeonColor(random);
  }, [activeLink, neonPalette]);

  // Sélectionner les items de navigation selon le rôle
  const navItems = navConfigs[role] || navConfigs.admin;
  
  // Définir le lien du logo selon le rôle
  const defaultLogoHref = logoHref || `/${role}/dashboard`;

  return (
    <nav className={styles.navbar}>
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />

      <div className={styles.container}>
        
        {/* Logo avec hover effect amélioré */}
        <a href={defaultLogoHref} className={cn('group', styles.logo)}>
          <span className={cn(styles.logoLink, styles.logoText)}>
            ARROW
          </span>
          
          {/* Badge de rôle */}
          <span className={styles.roleBadge}>
            {role.toUpperCase()}
          </span>
          
          {/* Glow effect behind logo */}
          <div className={styles.logoGlow} />
        </a>

        {/* Barre de recherche - Visible sur desktop si showSearch est true */}
        {showSearch && (
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) {
                  onSearch(e.target.value);
                }
              }}
              className={styles.searchInput}
            />
          </div>
        )}

        {/* Desktop menu - Visible sur écrans desktop uniquement */}
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

        {/* Indicateur de connexion (desktop) */}
        <div className={styles.desktopOnly} style={{ position: 'relative', marginLeft: '0.75rem' }}>
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
                href={role === 'admin' ? '/admin/settings' : `/${role}/profil`}
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

        {/* Zone mobile: statut + burger côte à côte */}
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
                href={role === 'admin' ? '/admin/settings' : `/${role}/profil`}
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
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className={styles.mobileBurger}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className={cn(styles.burgerIcon, styles.burgerIconRotated)} />
            ) : (
              <Menu className={styles.burgerIcon} />
            )}
            <div className={styles.burgerGlow} />
          </button>
        </div>
      </div>

      {/* Mobile drawer - Visible sur mobile uniquement */}
      {open && (
        <div className={cn('md:hidden', styles.mobileDrawer)}>
        {/* Scanlines mobile */}
        <div className={styles.mobileScanlines} />

        {/* Barre de recherche mobile */}
        {showSearch && (
          <div className={styles.mobileSearchContainer}>
            <Search size={20} className={styles.mobileSearchIcon} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) {
                  onSearch(e.target.value);
                }
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
                          onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
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
  );
}