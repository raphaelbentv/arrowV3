import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EtudiantCard } from '../../components/etudiants/EtudiantCard';
import { EtudiantForm } from '../../components/etudiants/EtudiantForm';
import { Etudiant, CreateEtudiantDto, UpdateEtudiantDto, StatutInscription, EtudiantFilters } from '../../types/etudiant';
import { etudiantsService } from '../../services/etudiants';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';
import { cohortesService } from '../../services/cohortes';
import { Cohorte } from '../../types/cohorte';

export const EtudiantsPage: React.FC = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [cohortes, setCohortes] = useState<Cohorte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<EtudiantFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [openFilters, setOpenFilters] = useState({ statut: false, cohorte: false, financement: false });
  const [showAdvancedMobile, setShowAdvancedMobile] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [etudiantsData, cohortesData] = await Promise.all([
        etudiantsService.getAll(),
        cohortesService.getAll(),
      ]);
      setEtudiants(etudiantsData);
      setCohortes(cohortesData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEtudiants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await etudiantsService.getAll();
      setEtudiants(data);
    } catch (err) {
      setError('Erreur lors du chargement des étudiants');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEtudiant = async (data: CreateEtudiantDto) => {
    try {
      setIsSubmitting(true);
      await etudiantsService.create(data);
      setShowForm(false);
      await loadEtudiants();
    } catch (err) {
      setError('Erreur lors de la création de l\'étudiant');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEtudiant = async (data: UpdateEtudiantDto) => {
    if (!editingEtudiant) return;
    
    try {
      setIsSubmitting(true);
      await etudiantsService.update(editingEtudiant._id, data);
      setShowForm(false);
      setEditingEtudiant(undefined);
      await loadEtudiants();
    } catch (err) {
      setError('Erreur lors de la modification de l\'étudiant');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEtudiant = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      return;
    }

    try {
      await etudiantsService.delete(id);
      await loadEtudiants();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'étudiant');
      console.error('Erreur:', err);
    }
  };

  const handleEditEtudiant = (etudiant: Etudiant) => {
    setEditingEtudiant(etudiant);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEtudiant(undefined);
  };

  const filteredEtudiants = etudiants.filter(etudiant => {
    if (filters.statutInscription && etudiant.statutInscription !== filters.statutInscription) return false;
    if (filters.cohorte) {
      const cohorteId = typeof etudiant.cohorteActuelle === 'object' 
        ? etudiant.cohorteActuelle._id 
        : etudiant.cohorteActuelle;
      if (cohorteId !== filters.cohorte) return false;
    }
    if (filters.typeFinancement && etudiant.typeFinancement !== filters.typeFinancement) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const fullName = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase();
      const email = etudiant.email?.toLowerCase() || '';
      const numero = etudiant.numeroEtudiant?.toLowerCase() || '';
      if (!fullName.includes(search) && !email.includes(search) && !numero.includes(search)) {
        return false;
      }
    }
    return true;
  });

  if (loading && etudiants.length === 0) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, filter: 'drop-shadow(0 0 20px rgba(61, 155, 255, 0.5))' }}>
          Chargement des étudiants...
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
          Gestion des Étudiants
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          size="lg"
          className="Add-button mb-4"
        >
          <Plus className="h-4 w-4" />
          Nouvel étudiant
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

      {/* Recherche et Filtres */}
      <div
        className={cn(styles['base-card'], styles['card-spacing-normal'])}
        style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '2rem' }}
      >
        <div className={styles['card-header']} style={{
          background: 'rgba(61,155,255,0.06)',
          padding: '0.75rem 1rem',
          borderLeft: '4px solid #3d9bff',
          borderRadius: '8px'
        }}>
          <h2 className={styles['card-title']} style={{ margin: 0, color: '#cbe7ff', textShadow: '0 0 10px rgba(61,155,255,0.4)' }}>
            Recherche et filtres ({filteredEtudiants.length} étudiant{filteredEtudiants.length > 1 ? 's' : ''})
          </h2>
          {/* Badge filtres actifs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span aria-label="Nombre de filtres actifs"
              style={{
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
              {['statutInscription','cohorte','typeFinancement'].filter(k => (filters as any)[k] !== undefined).length} filtre(s)
            </span>
            <button
              className="md:hidden"
              aria-label={showAdvancedMobile ? 'Masquer les filtres' : 'Afficher les filtres'}
              onClick={() => setShowAdvancedMobile(v => !v)}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(61,155,255,0.35)',
                color: '#87ceeb',
                background: 'rgba(61,155,255,0.08)'
              }}
            >
              {showAdvancedMobile ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>
        <div className={styles['card-section']}>
          {/* Recherche + Filtres (même grille, alignés à gauche) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Recherche */}
            <div className={cn("flex flex-col gap-3")}> 
              <Label className="mb-1 block text-xs md:text-sm uppercase text-gray-300 font-semibold" htmlFor="search">Recherche</Label>
              <Input
                id="search"
                aria-label="Rechercher étudiant"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, email, n° étudiant"
                className="tracking-[0.02em] w-full h-14"
                style={{
                  background: 'rgba(17,24,39,0.6)',
                  border: '2px solid rgba(61,155,255,0.35)',
                  color: '#cfeaff'
                }}
              />
            </div>

            {/* Statut */}
            <div className={cn("flex flex-col gap-3", !showAdvancedMobile && 'hidden md:flex')} style={{ marginBottom: openFilters.statut ? 220 : 0 }}>
              <Label className="mb-1 block text-xs md:text-sm uppercase text-gray-300 font-semibold" htmlFor="statut">Statut</Label>
              <Select
                open={openFilters.statut}
                onOpenChange={(o) => setOpenFilters(s => ({ ...s, statut: o }))}
                value={filters.statutInscription || 'all'}
                onValueChange={(v) => setFilters(prev => ({ ...prev, statutInscription: v === 'all' ? undefined : v as StatutInscription }))}
              >
                <SelectTrigger id="statut" aria-label="Filtrer par statut" className="w-full h-14 hover:ring-2 hover:ring-sky-400 hover:border-sky-400"
                  style={{
                    background: 'rgba(17,24,39,0.6)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#cfeaff'
                  }}
                >
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {[
                    StatutInscription.EN_ATTENTE,
                    StatutInscription.INSCRIT,
                    StatutInscription.ADMIS,
                    StatutInscription.NON_ADMIS,
                    StatutInscription.DIPLOME,
                    StatutInscription.ABANDON,
                    StatutInscription.EXCLUS,
                  ].map((statut) => (
                    <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cohorte */}
            <div className={cn("flex flex-col gap-3", !showAdvancedMobile && 'hidden md:flex')} style={{ marginBottom: openFilters.cohorte ? 220 : 0 }}>
              <Label className="mb-1 block text-xs md:text-sm uppercase text-gray-300 font-semibold" htmlFor="cohorte">Cohorte</Label>
              <Select
                open={openFilters.cohorte}
                onOpenChange={(o) => setOpenFilters(s => ({ ...s, cohorte: o }))}
                value={filters.cohorte || 'all'}
                onValueChange={(v) => setFilters(prev => ({ ...prev, cohorte: v === 'all' ? undefined : v }))}
              >
                <SelectTrigger id="cohorte" aria-label="Filtrer par cohorte" className="w-full h-14 hover:ring-2 hover:ring-sky-400 hover:border-sky-400"
                  style={{
                    background: 'rgba(17,24,39,0.6)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#cfeaff'
                  }}
                >
                  <SelectValue placeholder="Toutes les cohortes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les cohortes</SelectItem>
                  {cohortes.map((cohorte) => (
                    <SelectItem key={cohorte._id} value={cohorte._id}>{cohorte.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Total retiré: le nombre est inclus dans le titre de la carte */}
          </div>
        </div>
      </div>

      {/* Formulaire création/édition */}
      {showForm && (
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <EtudiantForm
            etudiant={editingEtudiant}
            onSubmit={editingEtudiant ? handleUpdateEtudiant : handleCreateEtudiant}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
            onDeleteEtudiant={editingEtudiant ? handleDeleteEtudiant : undefined}
          />
        </div>
      )}

      {/* Liste des étudiants */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {filteredEtudiants.length === 0 ? (
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)', gridColumn: '1 / -1' }}>
            <CardContent>
              <p className="text-lg font-bold uppercase tracking-[0.08em]" style={{ color: '#87ceeb' }}>Aucun étudiant trouvé</p>
              <p className="text-sm" style={{ color: '#a0aec0', marginTop: '0.5rem' }}>
                {searchTerm || Object.keys(filters).some(key => (filters as any)[key] !== undefined)
                  ? 'Essayez de modifier vos filtres ou votre recherche'
                  : 'Commencez par créer votre premier étudiant'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEtudiants.map((etudiant) => (
            <EtudiantCard
              key={etudiant._id}
              etudiant={etudiant}
              onEdit={handleEditEtudiant}
              onView={(e) => {
                window.location.href = `/admin/students/${e._id}`;
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
