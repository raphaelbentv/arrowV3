import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Home, Users, GraduationCap, BookOpen, Calendar, FileText, Settings, BarChart3, Search, UserCog, Phone, ShieldPlus, ClipboardCheck, User as UserIcon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import styles from './navbar.module.css';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/authContext';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
    // Bloc Opérationnel
    { label: 'Présences', href: '/admin/calls', icon: ClipboardCheck },
    { label: 'Étudiants', href: '/admin/students', icon: GraduationCap },
    { label: 'Cohortes', href: '/admin/cohortes', icon: BookOpen },
    // Bloc Pédagogique
    { label: 'Cours', href: '/admin/courses', icon: BookOpen },
    { label: 'Intervenants', href: '/admin/intervenant-list', icon: UserCog },
    // Bloc Structurel
    { label: 'Administrateurs', href: '/admin/administrators', icon: ShieldPlus },
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
          {role === 'admin' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Bloc Opérationnel: 0..2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {navItems.slice(0, 3).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeLink === item.href;
                  return (
                    <a
                      key={item.href}
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
                  );
                })}
              </div>

              {/* Séparateur entre groupes */}
              <div className="h-4 w-px bg-white/10 mx-6" />

              {/* Bloc Pédagogique: 3..4 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {navItems.slice(3, 5).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeLink === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn('group px-4 py-2 text-[15px] font-medium hover:text-gray-100', styles.navLink, isActive ? styles.navLinkActive : styles.navLinkInactive)}
                      style={isActive ? { color: neonColor, textShadow: `0 0 8px ${neonColor}, 0 0 16px ${neonColor}` } : { color: 'rgb(209 213 219)' }}
                    >
                      <div className={styles.iconContainer}>
                        <IconComponent className={styles.icon} />
                        <div className={styles.iconGlow} />
                      </div>
                      <span className={styles.navLabel}>{item.label}</span>
                      <span className={styles.underline} />
                      <div className={styles.particle} />
                    </a>
                  );
                })}
              </div>

              {/* Séparateur entre groupes */}
              <div className="h-4 w-px bg-white/10 mx-6" />

              {/* Bloc Structurel: 5 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {navItems.slice(5).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeLink === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn('group px-4 py-2 text-[15px] font-medium hover:text-gray-100', styles.navLink, isActive ? styles.navLinkActive : styles.navLinkInactive)}
                      style={isActive ? { color: neonColor, textShadow: `0 0 8px ${neonColor}, 0 0 16px ${neonColor}` } : { color: 'rgb(156 163 175)' }}
                    >
                      <div className={styles.iconContainer}>
                        <IconComponent className={styles.icon} />
                        <div className={styles.iconGlow} />
                      </div>
                      <span className={styles.navLabel}>{item.label}</span>
                      <span className={styles.underline} />
                      <div className={styles.particle} />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            // Rendu par défaut pour autres rôles
            navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeLink === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn('group px-4 py-2 text-[15px] font-medium hover:text-gray-100', styles.navLink, isActive ? styles.navLinkActive : styles.navLinkInactive)}
                >
                  <div className={styles.iconContainer}>
                    <IconComponent className={styles.icon} />
                    <div className={styles.iconGlow} />
                  </div>
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={styles.underline} />
                  <div className={styles.particle} />
                </a>
              );
            })
          )}
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
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn('group', styles.mobileNavItem)}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background glow on hover */}
                <div className={styles.mobileNavItemBg} />

                {/* Icon container with octagon shape */}
                <div className={styles.iconOctagon}>
                  <IconComponent className={styles.mobileIcon} />
                </div>

                {/* Label with gradient on hover */}
                <span className={styles.mobileNavLabel}>
                  {item.label}
                </span>
                
                {/* Arrow indicator with glow */}
                <span className={styles.mobileArrow}>
                  →
                </span>

                {/* Bottom border glow on hover */}
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