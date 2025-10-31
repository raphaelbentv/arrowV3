import React, { useState, useEffect } from 'react';
import { intervenantsService } from '../../services/intervenants';
import { Intervenant } from '../../types/intervenant';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import IntervenantCard from '../../components/intervenantCard';
import styles from '@/components/admin/cards.module.css';
import { cn } from '@/lib/utils';

const IntervenantList: React.FC = () => {
  // États pour gérer les données et l'UI
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [filteredIntervenants, setFilteredIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntervenant, setSelectedIntervenant] = useState<Intervenant | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [connectionInfo, setConnectionInfo] = useState<string>('');

  // Charger les intervenants au chargement de la page
  useEffect(() => {
    fetchIntervenants();
  }, []);

  // Fonction pour récupérer les intervenants depuis l'API
  const fetchIntervenants = async () => {
    try {
      setLoading(true);
      setConnectionInfo('Tentative de connexion à la base de données...');
      const token = localStorage.getItem('token');
      setConnectionInfo(token ? 'Token trouvé, envoi de la requête à l\'API...' : 'Mode dev: pas de token, envoi de la requête...');
      const data = await intervenantsService.getAll();
      // Exclure ceux archivés côté client
      const raw = localStorage.getItem('intervenant_state');
      const state = raw ? JSON.parse(raw) : {};
      const visible = data.filter((i) => !state[i._id]?.archived);
      
      if (visible && visible.length > 0) {
        setConnectionInfo('Connexion réussie. Données récupérées avec succès.');
        setIntervenants(visible);
        setFilteredIntervenants(visible);
        setError(null);
      } else {
        setConnectionInfo('Connexion réussie, mais aucun intervenant trouvé dans la base de données.');
        setIntervenants([]);
        setFilteredIntervenants([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des intervenants:', err);
      setConnectionInfo('Échec de la connexion à la base de données.');
      setError('Impossible de charger les intervenants. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche
  const handleSearch = (query: string | React.ChangeEvent<HTMLInputElement>) => {
    const q = typeof query === 'string' ? query : query.target.value;
    const normalized = q.toLowerCase();
    setSearchQuery(normalized);
    if (!normalized) {
      setFilteredIntervenants(intervenants);
      return;
    }
    const filtered = intervenants.filter(intervenant => 
      intervenant.nom?.toLowerCase().includes(normalized) ||
      intervenant.prenom?.toLowerCase().includes(normalized) ||
      intervenant.email?.toLowerCase().includes(normalized) ||
      intervenant.telephone?.toLowerCase().includes(normalized) ||
      intervenant.poste?.toLowerCase().includes(normalized) ||
      (intervenant.domainesExpertise && 
        intervenant.domainesExpertise.some(domaine => 
          domaine.toLowerCase().includes(normalized)
        )) ||
      (intervenant.modulesEnseignes && 
        intervenant.modulesEnseignes.some(module => 
          module.toLowerCase().includes(normalized)
        ))
    );
    
    setFilteredIntervenants(filtered);
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (intervenant: Intervenant) => {
    setSelectedIntervenant(intervenant);
    setDeleteDialogOpen(true);
  };

  // Fermer la boîte de dialogue de confirmation de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIntervenant(null);
  };

  // Supprimer un intervenant
  const handleDeleteIntervenant = async () => {
    if (!selectedIntervenant) return;
    
    try {
      // Ici, vous devrez implémenter la méthode de suppression dans votre service
      // await intervenantsService.delete(selectedIntervenant._id);
      
      // Pour l'instant, simulons la suppression côté client
      const updatedIntervenants = intervenants.filter(
        intervenant => intervenant._id !== selectedIntervenant._id
      );
      setIntervenants(updatedIntervenants);
      setFilteredIntervenants(
        filteredIntervenants.filter(
          intervenant => intervenant._id !== selectedIntervenant._id
        )
      );
      
      setSnackbar({
        open: true,
        message: `${selectedIntervenant.prenom} ${selectedIntervenant.nom} a été supprimé avec succès.`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'intervenant:', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de l\'intervenant.',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Afficher un message spécifique si aucun intervenant n'est trouvé
  if (!loading && intervenants.length === 0 && !error) {
      return (
        <MainLayout>
          <div className="p-4">
            <div className="mb-4">
              <Typography variant="h4" className="m-0">Gestion des Intervenants</Typography>
              <Typography variant="muted" className="mt-1">Liste et gestion des intervenants de la plateforme</Typography>
            </div>

            <Button
              onClick={() => {
                setSnackbar({ open: true, message: 'Fonctionnalité d\'ajout à implémenter', severity: 'info' });
              }}
              className="mb-3"
            >
              Ajouter un intervenant
            </Button>

            <Card>
              <CardContent>
                <Typography variant="h6" className="text-muted-foreground mt-0">Aucun intervenant trouvé dans la base de données</Typography>
                <Typography>Utilisez le bouton "Ajouter un intervenant" ci-dessus pour commencer à créer des profils d'intervenants.</Typography>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      );
  }

  // Afficher un indicateur de chargement pendant le chargement des données
  if (loading) {
      return (
        <MainLayout>
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-8 h-8 border-[3px] border-muted border-t-primary rounded-full animate-spin" />
            <p className="mt-2">{connectionInfo}</p>
          </div>
        </MainLayout>
      );
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error) {
      return (
        <MainLayout>
          <div className="p-4">
            <div role="alert" className="bg-red-50 text-red-900 border border-red-200 rounded-md px-4 py-3 mt-2">
              {error}
            </div>
            <p className="text-muted-foreground mt-2 mb-4">{connectionInfo}</p>
            <div className="flex justify-center mt-2">
              <Button onClick={fetchIntervenants}>Réessayer</Button>
            </div>
          </div>
        </MainLayout>
      );
  }

  return (
    <MainLayout>
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="flex flex-col items-start mb-8">
          <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Administration • Intervenants</div>
          <div className="flex items-end gap-4 flex-wrap mt-1">
            <h1 
              className="text-3xl font-black tracking-[0.15em] uppercase m-0"
              style={{
                background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))',
              }}
            >
              Gestion des Intervenants
            </h1>
            <span className="inline-flex items-center rounded-full border text-xs font-semibold px-3 py-1" style={{
              background: 'rgba(61,155,255,0.10)',
              borderColor: 'rgba(61,155,255,0.35)',
              color: '#87ceeb'
            }}>
              {filteredIntervenants.length} au total
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Liste, recherche et gestion des intervenants de la plateforme.</p>
          <Button onClick={() => setSnackbar({ open: true, message: 'Fonctionnalité d\'ajout à implémenter', severity: 'info' })} size="lg" className="Add-button mt-4">
            Nouvel intervenant
          </Button>
        </div>

        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '2rem' }}>
          <div className={styles['card-header']} style={{
            background: 'rgba(61,155,255,0.06)',
            padding: '0.75rem 1rem',
            borderLeft: '4px solid #3d9bff',
            borderRadius: '8px'
          }}>
            <h2 className={styles['card-title']} style={{ margin: 0, color: '#cbe7ff', textShadow: '0 0 10px rgba(61,155,255,0.4)' }}>
              Recherche et filtres ({filteredIntervenants.length} intervenant{filteredIntervenants.length > 1 ? 's' : ''})
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
              <div className="flex flex-col gap-3">
                <Label className="mb-1 block text-xs md:text-sm uppercase text-gray-300 font-semibold" htmlFor="search-intervenants">Recherche</Label>
                <Input
                  id="search-intervenants"
                  aria-label="Rechercher intervenant"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Nom, email, domaine, module"
                  className="tracking-[0.02em] w-full h-14"
                  style={{
                    background: 'rgba(17,24,39,0.6)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#cfeaff'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
          <div className={styles['card-header']} style={{
            background: 'rgba(61,155,255,0.06)',
            padding: '0.75rem 1rem',
            borderLeft: '4px solid #3d9bff',
            borderRadius: '8px'
          }}>
            <h2 className={styles['card-title']} style={{ margin: 0, color: '#cbe7ff', textShadow: '0 0 10px rgba(61,155,255,0.4)' }}>
              Liste des intervenants
            </h2>
          </div>
          <div className={styles['card-section']}>
            <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', rowGap: '2.25rem', columnGap: '2.25rem' }}>
              {filteredIntervenants.length === 0 ? (
                <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)', gridColumn: '1 / -1' }}>
                  <CardContent>
                    <p className="text-lg font-bold uppercase tracking-[0.08em]" style={{ color: '#87ceeb' }}>Aucun intervenant trouvé</p>
                    <p className="text-sm" style={{ color: '#a0aec0', marginTop: '0.5rem' }}>
                      {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par créer votre premier intervenant'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
            filteredIntervenants.map((intervenant) => (
                  <div style={{ padding: '0.25rem' }}>
                    <IntervenantCard key={intervenant._id} intervenant={intervenant} />
                  </div>
            ))
              )}
            </div>
          </div>
        </div>

        {deleteDialogOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
            <div className="bg-background rounded-lg p-4 w-full max-w-[480px] shadow-xl border">
              <Typography variant="h3" className="mt-0">Confirmer la suppression</Typography>
              <Typography className="mt-2">
                Êtes-vous sûr de vouloir supprimer l'intervenant {selectedIntervenant?.prenom} {selectedIntervenant?.nom} ? Cette action est irréversible.
              </Typography>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCloseDeleteDialog}>Annuler</Button>
                <Button variant="destructive" onClick={handleDeleteIntervenant}>Supprimer</Button>
              </div>
            </div>
          </div>
        )}

        {snackbar.open && (
          <div
            onClick={handleCloseSnackbar}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-md cursor-pointer shadow-lg"
          >
            {snackbar.message}
          </div>
        )}

      {/* Navigation vers la page de détail assurée par IntervenantCard (sans modal ici) */}
      </div>
    </MainLayout>
  );
};

export default IntervenantList;