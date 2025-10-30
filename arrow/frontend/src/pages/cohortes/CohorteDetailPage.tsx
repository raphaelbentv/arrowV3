import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cohortesService } from '../../services/cohortes';
import { etudiantsService } from '../../services/etudiants';
import { intervenantsService } from '../../services/intervenants';
import { Cohorte } from '../../types/cohorte';
import { Etudiant } from '../../types/etudiant';
import { Intervenant } from '../../types/intervenant';
import styles from '@/components/admin/cards.module.css';

export const CohorteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cohorte, setCohorte] = useState<Cohorte | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await cohortesService.getById(id);
          setCohorte(data);
        }
      } catch (e) {
        setError("Erreur lors du chargement de la cohorte");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadLists = async () => {
      if (!cohorte?._id) return;
      try {
        setLoadingLists(true);
        // Étudiants de la cohorte (endpoint supporte ?cohorte=)
        const [etuds, intervsAll] = await Promise.all([
          etudiantsService.getAll(cohorte._id),
          intervenantsService.getAll().catch(() => [] as Intervenant[]),
        ]);
        setEtudiants(etuds);

        // Si la cohorte a des IDs intervenants, filtrer la liste globale
        const ids = Array.isArray(cohorte.intervenants) ? new Set(cohorte.intervenants.map((x: any) => (typeof x === 'string' ? x : x?._id))) : new Set<string>();
        const filteredInterv = intervsAll.filter((i) => ids.has(i._id));
        setIntervenants(filteredInterv);
      } finally {
        setLoadingLists(false);
      }
    };
    loadLists();
  }, [cohorte]);

  if (loading) return <div style={{ padding: '2rem' }}>Chargement…</div>;
  if (error) return <div style={{ padding: '2rem', color: '#f87171' }}>{error}</div>;
  if (!cohorte) return <div style={{ padding: '2rem' }}>Cohorte introuvable</div>;

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className={styles['base-card']} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '1rem' }}>
        <div className={styles['card-header']}>
          <h1 className={styles['card-title']} style={{ margin: 0 }}>{cohorte.nom}</h1>
        </div>
        {/* Identification */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Année</span>
              <span className={styles['card-text-primary']}>{cohorte.anneeScolaire || '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Cursus</span>
              <span className={styles['card-text-primary']}>{cohorte.typeFormation || '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Diplôme</span>
              <span className={styles['card-text-primary']}>{cohorte.diplome || '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Statut</span>
              <span className={styles['card-text-primary']}>{cohorte.statut || '—'}</span>
            </div>
          </div>
        </div>

        {/* Organisation */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Début</span>
              <span className={styles['card-text-primary']}>{cohorte.dateDebut ? new Date(cohorte.dateDebut).toLocaleDateString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Fin</span>
              <span className={styles['card-text-primary']}>{cohorte.dateFin ? new Date(cohorte.dateFin).toLocaleDateString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Volume horaire total</span>
              <span className={styles['card-text-primary']}>{typeof cohorte.volumeHoraireTotal === 'number' ? cohorte.volumeHoraireTotal.toLocaleString('fr-FR') : '—'}</span>
            </div>
          </div>
        </div>

        {/* Composition */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Étudiants</span>
              <span className={styles['card-text-primary']}>{Array.isArray(cohorte.etudiants) ? cohorte.etudiants.length : 0}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Intervenants</span>
              <span className={styles['card-text-primary']}>{Array.isArray(cohorte.intervenants) ? cohorte.intervenants.length : 0}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Dossiers de cours</span>
              <span className={styles['card-text-primary']}>{Array.isArray(cohorte.dossiersCours) ? cohorte.dossiersCours.length : 0}</span>
            </div>
          </div>

          {/* Liste des étudiants de la cohorte */}
          <div className={styles['card-subsection']} style={{ marginTop: '1rem' }}>
            <div className={styles['card-row']} style={{ marginBottom: '0.5rem' }}>
              <span className={styles['card-text-secondary']}>Liste des étudiants</span>
              <span className={styles['card-text-secondary']}>{loadingLists ? 'Chargement…' : ''}</span>
            </div>
            <div style={{ maxHeight: 220, overflow: 'auto', border: '1px solid rgba(61, 155, 255, 0.2)', borderRadius: 8, padding: '0.5rem' }}>
              {etudiants.length === 0 ? (
                <div className={styles['card-text-secondary']}>Aucun étudiant</div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {etudiants.map((e) => (
                    <li key={e._id} className={styles['card-text-primary']} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>{e.prenom} {e.nom}</span>
                      <span className={styles['card-text-secondary']} style={{ marginLeft: 8 }}>{e.email || ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Liste des intervenants de la cohorte */}
          <div className={styles['card-subsection']} style={{ marginTop: '1rem' }}>
            <div className={styles['card-row']} style={{ marginBottom: '0.5rem' }}>
              <span className={styles['card-text-secondary']}>Liste des intervenants</span>
              <span className={styles['card-text-secondary']}>{loadingLists ? 'Chargement…' : ''}</span>
            </div>
            <div style={{ maxHeight: 180, overflow: 'auto', border: '1px solid rgba(61, 155, 255, 0.2)', borderRadius: 8, padding: '0.5rem' }}>
              {intervenants.length === 0 ? (
                <div className={styles['card-text-secondary']}>Aucun intervenant</div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  {intervenants.map((i) => (
                    <li key={i._id} className={styles['card-text-primary']} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>{i.nom} {i.prenom}</span>
                      <span className={styles['card-text-secondary']} style={{ marginLeft: 8 }}>{i.email || ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Structure pédagogique */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Modules</span>
              <span className={styles['card-text-primary']}>{Array.isArray(cohorte.modules) ? cohorte.modules.length : 0}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Cours</span>
              <span className={styles['card-text-primary']}>{Array.isArray(cohorte.cours) ? cohorte.cours.length : 0}</span>
            </div>
            <div className={styles['card-row']} style={{ gridColumn: '1 / -1' }}>
              <span className={styles['card-text-secondary']}>Liens dossiers</span>
              <span className={styles['card-text-primary']}>
                {Array.isArray(cohorte.dossiersCours) && cohorte.dossiersCours.length > 0
                  ? (
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {cohorte.dossiersCours.map((url, idx) => (
                        <li key={idx}>
                          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#3d9bff' }}>{url}</a>
                        </li>
                      ))}
                    </ul>
                  )
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Suivi pédagogique */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Présence moyenne</span>
              <span className={styles['card-text-primary']}>{typeof cohorte.tauxPresenceMoyen === 'number' ? `${cohorte.tauxPresenceMoyen}%` : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Progression</span>
              <span className={styles['card-text-primary']}>{typeof cohorte.tauxProgression === 'number' ? `${cohorte.tauxProgression}%` : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Dernier appel</span>
              <span className={styles['card-text-primary']}>{cohorte.dernierAppel ? new Date(cohorte.dernierAppel).toLocaleString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Sessions prévues</span>
              <span className={styles['card-text-primary']}>{typeof cohorte.nbSessionsPrevues === 'number' ? cohorte.nbSessionsPrevues.toLocaleString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Sessions effectuées</span>
              <span className={styles['card-text-primary']}>{typeof cohorte.nbSessionsEffectuees === 'number' ? cohorte.nbSessionsEffectuees.toLocaleString('fr-FR') : '—'}</span>
            </div>
          </div>
        </div>

        {/* Métadonnées et gestion */}
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Créée par</span>
              <span className={styles['card-text-primary']}>{cohorte.createdBy || '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Créée le</span>
              <span className={styles['card-text-primary']}>{cohorte.createdAt ? new Date(cohorte.createdAt).toLocaleString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Mise à jour</span>
              <span className={styles['card-text-primary']}>{cohorte.updatedAt ? new Date(cohorte.updatedAt).toLocaleString('fr-FR') : '—'}</span>
            </div>
            <div className={styles['card-row']} style={{ gridColumn: '1 / -1' }}>
              <span className={styles['card-text-secondary']}>Notes internes</span>
              <span className={styles['card-text-primary']}>{cohorte.notesInternes || '—'}</span>
            </div>
            <div className={styles['card-row']} style={{ gridColumn: '1 / -1' }}>
              <span className={styles['card-text-secondary']}>Tags</span>
              <span className={styles['card-text-primary']}>
                {Array.isArray(cohorte.tags) && cohorte.tags.length > 0 ? cohorte.tags.join(', ') : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Link to="/admin/cohortes" className={styles['card-button']}>← Retour</Link>
    </div>
  );
};
