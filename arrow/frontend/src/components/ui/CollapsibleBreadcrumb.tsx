import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { etudiantsService } from '@/services/etudiants';
import { intervenantsService } from '@/services/intervenants';

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
      intervenants: 'Intervenants',
      cohortes: 'Cohortes',
      modules: 'Modules',
      settings: 'Paramètres',
      calls: 'Présences',
    };
    return mapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Récupération dynamique pour certains IDs (étudiant ou intervenant)
  useEffect(() => {
    const load = async () => {
      setDynamicLastLabel(null);
      if (pathParts.length >= 2) {
        const last = pathParts[pathParts.length - 1];
        const prev = pathParts[pathParts.length - 2];
        const looksLikeId = /^[a-f0-9\-]{6,}$/i.test(last);
        
        // Gestion des étudiants
        if (prev === 'students' && looksLikeId) {
          try {
            const etu = await etudiantsService.getById(last);
            const display = [etu.prenom, etu.nom].filter(Boolean).join(' ').trim();
            if (display) setDynamicLastLabel(display);
          } catch {
            // ignore en silencieux
          }
        }
        
        // Gestion des intervenants
        if ((prev === 'intervenant' || prev === 'intervenants') && looksLikeId) {
          try {
            const interv = await intervenantsService.getOne(last);
            const display = [interv.prenom, interv.nom].filter(Boolean).join(' ').trim();
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
    let href = '';
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

  return (
    <div
      ref={containerRef}
      role="navigation"
      aria-label="Fil d'Ariane"
      className={cn(
        'flex items-center select-none mb-6 transition-opacity duration-300 ease-out',
        expanded ? 'opacity-100' : 'opacity-50'
      )}
      style={{ paddingLeft: '2rem' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Icône flèche dans cercle jaune néon */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
          'transition-all duration-300 ease-out cursor-pointer',
          'border-2 border-[#FFEA00]',
          expanded
            ? 'bg-[#FFEA00] shadow-[0_0_25px_rgba(255,234,0,0.8)] scale-105'
            : 'bg-[rgba(255,234,0,0.15)] shadow-[0_0_15px_rgba(255,234,0,0.5)] hover:bg-[rgba(255,234,0,0.25)]'
        )}
      >
        <ArrowRight
          className={cn(
            'h-5 w-5 transition-all duration-300',
            expanded
              ? 'text-[#0a0a0a] rotate-90'
              : 'text-[#FFEA00]'
          )}
        />
      </div>

      {/* Chemin qui s'affiche sur la même ligne */}
      <div
        className={cn(
          'flex items-center gap-2 overflow-hidden transition-all duration-300 ease-out',
          expanded
            ? 'opacity-100 max-w-[1000px] translate-x-0'
            : 'opacity-0 max-w-0 translate-x-[-10px]'
        )}
        style={expanded ? { marginLeft: '1.5rem' } : { marginLeft: '0' }}
      >
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          
          return (
            <React.Fragment key={idx}>
              {!isLast ? (
                <>
                  <Link
                    to={c.href || '#'}
                    className={cn(
                      'text-sm text-[#87ceeb] hover:text-[#3d9bff]',
                      'transition-colors duration-200',
                      'whitespace-nowrap'
                    )}
                    tabIndex={expanded ? 0 : -1}
                  >
                    {c.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-[rgba(61,155,255,0.4)]" />
                </>
              ) : (
                <span
                  className={cn(
                    'text-sm font-medium text-[#3d9bff]',
                    'whitespace-nowrap'
                  )}
                  aria-current="page"
                >
                  {c.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsibleBreadcrumb;
