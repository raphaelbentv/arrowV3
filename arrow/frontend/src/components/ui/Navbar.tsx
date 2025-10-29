import { useState } from 'react';
import { Menu, X, Home, Users, GraduationCap, BookOpen, Calendar, FileText, Settings, BarChart3, Search } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import styles from './navbar.module.css';
import { cn } from '@/lib/utils';

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
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'Cohortes', href: '/admin/cohortes', icon: GraduationCap },
    { label: 'Utilisateurs', href: '/admin/users', icon: Users },
    { label: 'Intervenants', href: '/admin/intervenant-list', icon: BookOpen },
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
              <a
                key={item.href}
                href={item.href}
                className={cn('group', styles.navLink, isActive ? styles.navLinkActive : styles.navLinkInactive)}
              >
                {/* Icon with glow */}
                <div className={styles.iconContainer}>
                  <IconComponent className={styles.icon} />
                  <div className={styles.iconGlow} />
                </div>

                {/* Label with gradient hover */}
                <span className={styles.navLabel}>
                  {item.label}
                </span>
                
                {/* Underline animée avec glow */}
                <span className={styles.underline} />

                {/* Particles on hover */}
                <div className={styles.particle} />
              </a>
            );
          })}
        </div>


        {/* Mobile burger button - Visible sur mobile uniquement */}
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