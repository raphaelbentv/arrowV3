import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ModuleCard } from '../../components/modules/ModuleCard';
import { ModuleForm } from '../../components/modules/ModuleForm';
import { ModuleCours } from '../../types/module';
import { modulesService } from '../../services/modules';
import { SearchFiltersCard, FilterConfig } from '@/components/ui/SearchFiltersCard';

interface ModuleFilters {
  actif?: boolean;
  semestre?: string;
}

export const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<ModuleCours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleCours | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<ModuleFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modulesService.getAll();
      setModules(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateModule = async (data: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      await modulesService.create(data);
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError('Erreur lors de la création du module');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateModule = async (data: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingModule) return;
    
    try {
      setIsSubmitting(true);
      await modulesService.update(editingModule._id as string, data);
      setShowForm(false);
      setEditingModule(undefined);
      await loadData();
    } catch (err) {
      setError('Erreur lors de la modification du module');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      return;
    }

    try {
      await modulesService.delete(id);
      await loadData();
    } catch (err) {
      setError('Erreur lors de la suppression du module');
      console.error('Erreur:', err);
    }
  };

  const handleEditModule = (module: ModuleCours) => {
    setEditingModule(module);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingModule(undefined);
  };

  const filteredModules = modules.filter(module => {
    if (filters.actif !== undefined && (module.actif ?? true) !== filters.actif) return false;
    if (filters.semestre && module.semestre !== filters.semestre) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nom = module.nom?.toLowerCase() || '';
      const code = module.code?.toLowerCase() || '';
      const description = module.descriptionCourte?.toLowerCase() || '';
      if (!nom.includes(search) && !code.includes(search) && !description.includes(search)) {
        return false;
      }
    }
    return true;
  });

  // Configuration des filtres pour SearchFiltersCard
  const filterConfigs = useMemo<FilterConfig[]>(() => {
    // Récupérer tous les semestres uniques
    const semestres = Array.from(new Set(modules.map(m => m.semestre).filter(Boolean))) as string[];
    
    return [
      {
        id: 'actif',
        label: 'Statut',
        placeholder: 'Tous les statuts',
        value: filters.actif === undefined ? undefined : filters.actif ? 'true' : 'false',
        options: [
          { value: 'true', label: 'Actif' },
          { value: 'false', label: 'Inactif' },
        ],
        onValueChange: (v) =>
          setFilters((prev) => ({ ...prev, actif: v === undefined ? undefined : v === 'true' })),
      },
      ...(semestres.length > 0 ? [{
        id: 'semestre',
        label: 'Semestre',
        placeholder: 'Tous les semestres',
        value: filters.semestre,
        options: semestres.map((semestre) => ({
          value: semestre,
          label: semestre,
        })),
        onValueChange: (v) => setFilters((prev) => ({ ...prev, semestre: v })),
      }] : []),
    ];
  }, [filters, modules]);

  if (loading && modules.length === 0) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, filter: 'drop-shadow(0 0 20px rgba(61, 155, 255, 0.5))' }}>
          Chargement des modules...
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
          Gestion des Modules
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          size="lg"
          className="Add-button mb-4"
        >
          <Plus className="h-4 w-4" />
          Nouveau module
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

      {/* Carte Recherche + Filtres */}
      <SearchFiltersCard
        title="Recherche et filtres"
        searchValue={searchTerm}
        searchPlaceholder="Nom, code, description"
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        resultCount={filteredModules.length}
        resultLabel="module"
      />

      {/* Formulaire création/édition */}
      {showForm && (
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <ModuleForm
            module={editingModule}
            onSubmit={editingModule ? handleUpdateModule : handleCreateModule}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
            onDeleteModule={editingModule ? handleDeleteModule : undefined}
          />
        </div>
      )}

      {/* Liste des modules */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {filteredModules.length === 0 ? (
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)', gridColumn: '1 / -1' }}>
            <CardContent>
              <p className="text-lg font-bold uppercase tracking-[0.08em]" style={{ color: '#87ceeb' }}>Aucun module trouvé</p>
              <p className="text-sm" style={{ color: '#a0aec0', marginTop: '0.5rem' }}>
                {searchTerm || Object.keys(filters).some(key => (filters as any)[key] !== undefined)
                  ? 'Essayez de modifier vos filtres ou votre recherche'
                  : 'Commencez par créer votre premier module'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredModules.map((module) => (
            <ModuleCard
              key={module._id}
              module={module}
              onEdit={handleEditModule}
              onDelete={handleDeleteModule}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ModulesPage;


