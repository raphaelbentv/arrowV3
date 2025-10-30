import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CohorteCard } from '../../components/cohortes/CohorteCard';
import { CohorteForm } from '../../components/cohortes/CohorteForm';
import { Cohorte, CreateCohorteDto, UpdateCohorteDto, CohorteFilters, TypeFormation } from '../../types/cohorte';
import { cohortesService } from '../../services/cohortes';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';

export const CohortesPage: React.FC = () => {
  const [cohortes, setCohortes] = useState<Cohorte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCohorte, setEditingCohorte] = useState<Cohorte | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<CohorteFilters>({});
  const [openFilters, setOpenFilters] = useState({ annee: false, cursus: false, statut: false });

  useEffect(() => {
    loadCohortes();
  }, []);

  const loadCohortes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cohortesService.getAll();
      setCohortes(data);
    } catch (err) {
      setError('Erreur lors du chargement des cohortes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohorte = async (data: CreateCohorteDto) => {
    try {
      setIsSubmitting(true);
      await cohortesService.create(data);
      setShowForm(false);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la création de la cohorte');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCohorte = async (data: UpdateCohorteDto) => {
    if (!editingCohorte) return;
    
    try {
      setIsSubmitting(true);
      await cohortesService.update(editingCohorte._id, data);
      setShowForm(false);
      setEditingCohorte(undefined);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la modification de la cohorte');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCohorte = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette cohorte ?')) {
      return;
    }

    try {
      await cohortesService.delete(id);
      await loadCohortes();
    } catch (err) {
      setError('Erreur lors de la suppression de la cohorte');
      console.error('Erreur:', err);
    }
  };

  const handleEditCohorte = (cohorte: Cohorte) => {
    setEditingCohorte(cohorte);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCohorte(undefined);
  };

  const filteredCohortes = cohortes.filter(cohorte => {
    if (filters.anneeScolaire && cohorte.anneeScolaire !== filters.anneeScolaire) return false;
    if (filters.typeFormation && cohorte.typeFormation !== filters.typeFormation) return false;
    // filtre actif non applicable avec le nouveau schéma
    return true;
  });

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, filter: 'drop-shadow(0 0 20px rgba(61, 155, 255, 0.5))' }}>
          Chargement des cohortes...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="flex flex-col items-start mb-8">
        <h1 
          className="text-3xl font-black tracking-[0.15em] uppercase mb-4"
          style={{
            background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))',
          }}
        >
          Gestion des Cohortes
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          size="lg"
          className="font-bold uppercase tracking-[0.08em] mb-4"
        >
          <Plus className="h-4 w-4" />
          Nouvelle cohorte
        </Button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          background: 'rgba(220, 38, 38, 0.2)',
          border: '2px solid rgba(220, 38, 38, 0.5)',
          borderRadius: '12px',
          color: '#ff6b6b',
          marginBottom: '1.5rem',
        }}>{error}</div>
      )}

      {/* Filtres (design cartes admin) */}
      <div
        className={cn(styles['base-card'], styles['card-spacing-normal'])}
        style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '2rem' }}
      >
        <div className={styles['card-header']}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>Filtres</h2>
        </div>
        <div className={styles['card-section']}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2" style={{ marginBottom: openFilters.annee ? 220 : 0 }}>
              <Label className="mb-2 block" htmlFor="annee">Année</Label>
              <Select open={openFilters.annee} onOpenChange={(o) => setOpenFilters(s => ({ ...s, annee: o }))} value={filters.anneeScolaire || 'all'} onValueChange={(v) => setFilters(prev => ({ ...prev, anneeScolaire: v === 'all' ? undefined : v }))}>
                <SelectTrigger id="annee" className="uppercase tracking-[0.05em] w-full h-14"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#87ceeb'
                  }}
                >
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2" style={{ marginBottom: openFilters.cursus ? 220 : 0 }}>
              <Label className="mb-2 block" htmlFor="cursus">Cursus</Label>
              <Select open={openFilters.cursus} onOpenChange={(o) => setOpenFilters(s => ({ ...s, cursus: o }))} value={filters.typeFormation || 'all'} onValueChange={(v) => setFilters(prev => ({ ...prev, typeFormation: v === 'all' ? undefined : (v as TypeFormation) }))}>
                <SelectTrigger id="cursus" className="uppercase tracking-[0.05em] w-full h-14"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#87ceeb'
                  }}
                >
                  <SelectValue placeholder="Tous les cursus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cursus</SelectItem>
                  <SelectItem value="BTS">BTS</SelectItem>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Mastère">Mastère</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2" style={{ marginBottom: openFilters.statut ? 220 : 0 }}>
              <Label className="mb-2 block" htmlFor="statut">Statut</Label>
              <Select open={openFilters.statut} onOpenChange={(o) => setOpenFilters(s => ({ ...s, statut: o }))} value={filters.actif === undefined ? 'all' : String(filters.actif)} onValueChange={(v) => setFilters(prev => ({ ...prev, actif: v === 'all' ? undefined : v === 'true' }))}>
                <SelectTrigger id="statut" className="uppercase tracking-[0.05em] w-full h-14"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#87ceeb'
                  }}
                >
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire création seulement (édition s'affiche en place dans la grille) */}
      {showForm && !editingCohorte && (
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <CohorteForm
            onSubmit={handleCreateCohorte}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {/* Liste des cohortes (responsive flex, gap vertical accru) */}
      <div className={styles['cards-container-flex']} style={{ marginTop: '2rem', rowGap: '2rem' }}>
        {filteredCohortes.length === 0 ? (
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)', width: '100%' }}>
            <CardContent>
              <p className="text-lg font-bold uppercase tracking-[0.08em]" style={{ color: '#87ceeb' }}>Aucune cohorte trouvée</p>
              <p className="text-sm" style={{ color: '#a0aec0', marginTop: '0.5rem' }}>
                {Object.keys(filters).some(key => (filters as any)[key] !== undefined)
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par créer votre première cohorte'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCohortes.map((cohorte) => (
            editingCohorte && editingCohorte._id === cohorte._id ? (
              <div key={cohorte._id} style={{ flex: '1 1 450px', minWidth: 350, maxWidth: 650 }}>
                <CohorteForm
                  cohorte={editingCohorte}
                  onSubmit={handleUpdateCohorte}
                  onCancel={handleCancelForm}
                  isLoading={isSubmitting}
                  onDeleteCohorte={async (id: string) => {
                    try {
                      await handleDeleteCohorte(id);
                      setShowForm(false);
                      setEditingCohorte(undefined);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                />
              </div>
            ) : (
              <CohorteCard
                key={cohorte._id}
                cohorte={cohorte}
                onEdit={handleEditCohorte}
                onView={(c) => {
                  window.location.href = `/admin/cohortes/${c._id}`;
                }}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};
