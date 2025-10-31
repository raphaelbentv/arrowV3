import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Navigation, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { etudiantsService } from '@/services/etudiants';

type Crumb = {
  label: string;
  href?: string;
  current?: boolean;
};

function useBreadcrumbs() {
  const location = useLocation();

  const [dynamicLastLabel, setDynamicLastLabel] = useState<string | null>(null);

  const pathParts = useMemo(() => {
    return location.pathname.split('/').filter(Boolean);
  }, [location.pathname]);

  // Mapping basique des segments vers labels
  const labelFor = (segment: string): string => {
    const mapping: Record<string, string> = {
      admin: 'Dashboard',
      dashboard: 'Dashboard',
      actors: 'Acteurs',
      students: 'Étudiants',
      intervenant: 'Intervenants',
      cohortes: 'Cohortes',
      modules: 'Modules',
      settings: 'Paramètres',
      calls: 'Présences',
    };
    return mapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Récupération dynamique pour certains IDs (ex: étudiant)
  useEffect(() => {
    const load = async () => {
      setDynamicLastLabel(null);
      if (pathParts.length >= 2) {
        const last = pathParts[pathParts.length - 1];
        const prev = pathParts[pathParts.length - 2];
        const looksLikeId = /^[a-f0-9\-]{6,}$/i.test(last);
        if (prev === 'students' && looksLikeId) {
          try {
            const etu = await etudiantsService.getById(last);
            const display = [etu.firstName, etu.lastName].filter(Boolean).join(' ').trim();
            if (display) setDynamicLastLabel(display);
          } catch {
            // ignore en silencieux
          }
        }
      }
    };
    load();
  }, [pathParts]);

  const crumbs: Crumb[] = useMemo(() => {
    const acc: Crumb[] = [];
    let href = ';
    pathParts.forEach((part, idx) => {
      href += `/${part}`;
      const isLast = idx === pathParts.length - 1;
      const baseLabel = labelFor(part);
      const label = isLast && dynamicLastLabel ? dynamicLastLabel : baseLabel;
      acc.push({ label, href: isLast ? undefined : href, current: isLast });
    });
    // Si vide -> racine
    if (acc.length === 0) return [{ label: 'Accueil', href: '/', current: true }];
    return acc;
  }, [pathParts, dynamicLastLabel]);

  return { crumbs, location };
}

export const CollapsibleBreadcrumb: React.FC = () => {
  const { crumbs } = useBreadcrumbs();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Accessibilité clavier: expand au focus, collapse au blur hors conteneur
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onFocusIn = () => setExpanded(true);
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) setExpanded(false);
    };
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const currentPageLabel = crumbs[crumbs.length - 1]?.label || 'Accueil';

  return (
    <div className="w-full">
      {/* Desktop / Tablet */}
      <div
        ref={containerRef}
        role="navigation"
        aria-label="Fil d'Ariane"
        className="relative flex items-center gap-2 h-8 select-none cursor-default hidden md:flex mb-4"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Wrapper toujours visible */}
        <div className="flex items-center gap-2 z-20 bg-background/95 backdrop-blur-sm transition-all duration-300">
          {/* Icône de navigation */}
          <button
            aria-label={expanded ? 'Réduire le fil d\'Ariane' : 'Étendre le fil d\'Ariane'}
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              'transition-all duration-300 ease-out group',
              expanded
                ? 'p-1.5 rounded-md bg-primary/10 text-primary shadow-[0_0_15px_rgba(51,102,255,0.2)]'
                : 'p-1.5 rounded-md bg-muted hover:bg-muted/80'
            )}
          >
            <Navigation
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                expanded && 'rotate-45 scale-110'
              )}
            />
          </button>

          {/* Page actuelle (toujours visible) */}
          <span
            className={cn(
              'font-medium text-sm whitespace-nowrap transition-colors duration-300',
              expanded ? 'text-primary' : 'text-foreground'
            )}
          >
            {currentPageLabel}
          </span>
        </div>

        {/* Container breadcrumb expandable */}
        <div
          className={cn(
            'absolute left-0 top-0 transition-all duration-500 ease-out',
            'flex items-center gap-1 h-8 px-3 pr-32 bg-background/95 backdrop-blur-md',
            'border border-border/50 rounded-lg shadow-lg shadow-primary/5',
            expanded
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 -translate-x-8 scale-95 pointer-events-none'
          )}
        >
          {/* Icône Home */}
          <Link
            to="/"
            className="p-1 rounded text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-200"
            tabIndex={expanded ? 0 : -1}
          >
            <Home className="h-4 w-4" />
          </Link>

          {/* Items du breadcrumb */}
          <div className="flex items-center gap-1">
            {crumbs.map((c, idx) => {
              const isLast = idx === crumbs.length - 1;
              const delayClass =
                idx === 0
                  ? 'animation-delay-100'
                  : idx === 1
                    ? 'animation-delay-200'
                    : 'animation-delay-300';

              return (
                <div
                  key={idx}
                  className={cn('flex items-center animate-in-fade-in', delayClass)}
                >
                  {!isLast ? (
                    <Link
                      to={c.href || '#'}
                      className="px-1.5 py-0.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                      tabIndex={expanded ? 0 : -1}
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span
                      className="px-1.5 py-0.5 rounded text-sm font-medium text-primary bg-primary/10"
                      aria-current="page"
                      tabIndex={expanded ? 0 : -1}
                    >
                      {c.label}
                    </span>
                  )}
                  {idx < crumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/30 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: bouton qui ouvre un drawer bas */}
      <div className="fixed top-16 left-0 right-0 z-30 mb-4 md:relative md:top-0 md:z-auto sm:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="h-8 inline-flex items-center gap-2 px-2 rounded-md bg-muted text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-300"
          aria-label="Ouvrir le fil d'Ariane"
        >
          <Navigation className="h-4 w-4" />
          <span className="text-sm">{currentPageLabel}</span>
        </button>

        {mobileOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="absolute left-0 right-0 bottom-0 rounded-t-2xl border border-border/50 bg-background/95 backdrop-blur-md shadow-lg p-4"
              style={{ transform: 'translateY(0)', transition: 'transform 300ms ease-out' }}
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Navigation</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-accent"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                {crumbs.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/30" />}
                    {!c.current ? (
                      <Link
                        to={c.href || '#'}
                        onClick={() => setMobileOpen(false)}
                        className="px-1.5 py-0.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-sm font-medium text-primary bg-primary/10">
                        {c.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleBreadcrumb;


