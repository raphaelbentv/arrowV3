import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';

export interface FilterConfig {
  id: string;
  label: string;
  placeholder?: string;
  value: string | undefined;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string | undefined) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface SearchFiltersCardProps {
  title?: string;
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  resultCount?: number;
  resultLabel?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  accordionContent?: React.ReactNode;
}

export const SearchFiltersCard: React.FC<SearchFiltersCardProps> = ({
  title = 'Recherche et filtres',
  searchValue,
  searchPlaceholder = 'Rechercher...',
  onSearchChange,
  filters,
  resultCount,
  resultLabel,
  headerContent,
  footerContent,
  accordionContent,
}) => {
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filtersAccordionOpen, setFiltersAccordionOpen] = useState(false);

  // Compteur de filtres actifs
  const activeFiltersCount = filters.filter(
    (filter) => filter.value !== undefined && filter.value !== 'all'
  ).length;

  // Gérer l'ouverture/fermeture des selects
  const handleOpenChange = (filterId: string, open: boolean) => {
    setOpenFilters((prev) => ({ ...prev, [filterId]: open }));
    const filter = filters.find((f) => f.id === filterId);
    if (filter?.onOpenChange) {
      filter.onOpenChange(open);
    }
  };

  const getOpenState = (filterId: string) => {
    return openFilters[filterId] ?? false;
  };

  // Construire le titre avec le compteur de résultats
  const titleWithCount = resultCount !== undefined && resultLabel
    ? `${title} (${resultCount} ${resultLabel}${resultCount > 1 ? 's' : ''})`
    : title;

  return (
    <>
      {/* Style global pour unifier les polices dans la carte */}
      <style>{`
        .search-filters-card input::placeholder,
        .search-filters-card input,
        .search-filters-card select,
        .search-filters-card [data-placeholder],
        .search-filters-card [role="option"],
        .search-filters-card button,
        .search-filters-card span,
        .search-filters-card label {
          font-family: 'League Spartan', sans-serif !important;
        }
      `}</style>
      <div
        id={title === 'Recherche et filtres' ? 'p-filters-card' : undefined}
        className={cn(styles['base-card'], styles['card-spacing-normal'], 'search-filters-card')}
        style={{ 
          borderTop: 'none',
          boxShadow: 'none', 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Bandeau avec gradient comme le bouton Add-button */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(135deg, #a3ff12, #3b82f6)',
            boxShadow: '0 0 20px rgba(163, 255, 18, 0.35), 0 0 15px rgba(59, 130, 246, 0.35)',
            zIndex: 2,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        />
      {headerContent && (
        <div style={{ padding: '1.5rem 1.5rem 0.75rem 1.5rem', position: 'relative', zIndex: 1 }}>
          {headerContent}
        </div>
      )}
      <div 
        className={styles['card-header']} 
        style={{ 
          position: 'relative', 
          zIndex: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: headerContent ? '0' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 auto', minWidth: '200px' }}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>
            {titleWithCount}
          </h2>
          {/* Badge filtres actifs */}
          {activeFiltersCount > 0 && (
            <span
              aria-label="Nombre de filtres actifs"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                background: 'rgba(61,155,255,0.18)',
                border: '1px solid rgba(61,155,255,0.35)',
                color: '#87ceeb',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              {activeFiltersCount} filtre(s)
            </span>
          )}
        </div>
        {/* Toggle pour afficher/masquer les options de recherche - Positionné en haut à droite, peut passer à la ligne sur mobile */}
        <label 
          id="p-accordion-toggle"
          className="neon-toggle" 
          style={{ 
            fontFamily: "'League Spartan', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '-0.25rem',
            flexBasis: 'auto',
            width: 'auto',
          }}
        >
          <input
            id="p-accordion-toggle-input"
            type="checkbox"
            checked={filtersAccordionOpen}
            onChange={(e) => setFiltersAccordionOpen(e.target.checked)}
            aria-label={filtersAccordionOpen ? 'Masquer les options de recherche' : 'Afficher les options de recherche'}
          />
          <span className="switch">
            <span className="knob" />
          </span>
          <span style={{
            fontFamily: "'League Spartan', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#87ceeb',
            textTransform: 'uppercase',
          }}>
            {filtersAccordionOpen ? 'Options masquées' : 'Options affichées'}
          </span>
        </label>
      </div>
      <div className={styles['card-section']} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Champ de recherche séparé */}
        <div className="flex flex-col gap-2 mb-4" style={{ width: '100%' }}>
          <Label
            id="p-search-label"
            className="block text-sm md:text-base uppercase font-bold"
            htmlFor="p-search-input"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              color: '#87ceeb',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}
          >
            Recherche
          </Label>
          <Input
            id="p-search-input"
            aria-label="Rechercher"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="tracking-[0.02em] w-full"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              height: '3rem',
              background: 'rgba(17,24,39,0.6)',
              border: '2px solid rgba(61,155,255,0.35)',
              color: '#cfeaff',
              fontSize: '0.95rem',
              padding: '0.75rem 1rem',
              boxShadow: '0 0 10px rgba(61,155,255,0.1)',
              margin: '0',
              width: '100%',
            }}
          />
        </div>

        {/* Accordéon pour les filtres */}
        {filters.length > 0 && (
          <div
              style={{
                border: '1px solid rgba(61,155,255,0.2)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginTop: '1.5rem',
              }}
            >

            {/* Contenu de l'accordéon */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: filtersAccordionOpen ? '2000px' : '0',
                opacity: filtersAccordionOpen ? 1 : 0,
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
                className="md:flex-row md:gap-0"
              >
                {/* Filtres avec séparateurs */}
                {filters.map((filter, index) => {
                  const isOpen = getOpenState(filter.id);
                  const isLast = index === filters.length - 1;
                  return (
                    <React.Fragment key={filter.id}>
                      <div
                        className="flex flex-col"
                        style={{
                          flex: '1 1 0',
                          minWidth: 0,
                          marginBottom: isOpen ? 220 : 0,
                        }}
                      >
                        <Label
                          id={`p-filter-${filter.id}-label`}
                          htmlFor={`p-filter-${filter.id}-select`}
                          style={{
                            fontFamily: "'League Spartan', sans-serif",
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#87ceeb',
                            marginBottom: '0.75rem',
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            padding: 0,
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {filter.label}
                        </Label>
                        <Select
                          open={isOpen}
                          onOpenChange={(open) => handleOpenChange(filter.id, open)}
                          value={filter.value || 'all'}
                          onValueChange={(v) =>
                            filter.onValueChange(v === 'all' ? undefined : v)
                          }
                        >
                          <SelectTrigger
                            id={`p-filter-${filter.id}-select`}
                            aria-label={`Filtrer par ${filter.label}`}
                            className="w-full hover:ring-2 hover:ring-sky-400 hover:border-sky-400 transition-all"
                            style={{
                              fontFamily: "'League Spartan', sans-serif",
                              height: '3rem',
                              background: 'rgba(17,24,39,0.6)',
                              border: '2px solid rgba(61,155,255,0.35)',
                              color: '#cfeaff',
                              fontSize: '0.95rem',
                              padding: '0.75rem 1rem',
                              boxShadow: '0 0 10px rgba(61,155,255,0.1)',
                              width: '100%',
                              margin: 0,
                            }}
                          >
                          <SelectValue
                            placeholder={filter.placeholder || `Tous les ${filter.label.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            fontFamily: "'League Spartan', sans-serif",
                            background: 'rgba(10, 10, 10, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(61, 155, 255, 0.3)',
                          }}
                          className="[&_[role=group]]:p-1.5"
                        >
                          <SelectItem 
                            value="all"
                            style={{
                              fontFamily: "'League Spartan', sans-serif",
                              paddingTop: '0.875rem',
                              paddingBottom: '0.875rem',
                              paddingLeft: '1.25rem',
                              paddingRight: '1.25rem',
                            }}
                            className="hover:bg-[rgba(61,155,255,0.2)] hover:text-[#87ceeb] focus:bg-[rgba(61,155,255,0.25)] focus:text-[#87ceeb] transition-colors"
                          >
                            {filter.placeholder || `Tous les ${filter.label.toLowerCase()}`}
                          </SelectItem>
                          {filter.options.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              style={{
                                fontFamily: "'League Spartan', sans-serif",
                                paddingTop: '0.875rem',
                                paddingBottom: '0.875rem',
                                paddingLeft: '1.25rem',
                                paddingRight: '1.25rem',
                              }}
                              className="hover:bg-[rgba(61,155,255,0.2)] hover:text-[#87ceeb] focus:bg-[rgba(61,155,255,0.25)] focus:text-[#87ceeb] transition-colors"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {!isLast && (
                      <div
                        style={{
                          width: '1px',
                          backgroundColor: 'rgba(61,155,255,0.15)',
                          margin: '0 1.5rem',
                          alignSelf: 'stretch',
                          display: 'none',
                        }}
                        className="md:block"
                      />
                    )}
                  </React.Fragment>
                );
              })}
              </div>
              {/* Contenu additionnel dans l'accordéon */}
              {accordionContent && (
                <div style={{ width: '100%', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(61,155,255,0.2)' }}>
                  {accordionContent}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {footerContent && (
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
          {footerContent}
        </div>
      )}
    </div>
    </>
  );
};

export default SearchFiltersCard;

