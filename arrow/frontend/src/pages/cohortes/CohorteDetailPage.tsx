import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cohortesService } from '../../services/cohortes';
import { Cohorte } from '../../types/cohorte';
import styles from '@/components/admin/cards.module.css';

export const CohorteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cohorte, setCohorte] = useState<Cohorte | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ padding: '2rem' }}>Chargement…</div>;
  if (error) return <div style={{ padding: '2rem', color: '#f87171' }}>{error}</div>;
  if (!cohorte) return <div style={{ padding: '2rem' }}>Cohorte introuvable</div>;

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className={styles['base-card']} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '1rem' }}>
        <div className={styles['card-header']}>
          <h1 className={styles['card-title']} style={{ margin: 0 }}>{cohorte.nom}</h1>
        </div>
        <div className={styles['card-section']}>
          <div className={styles['card-grid']} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Année</span>
              <span className={styles['card-text-primary']}>{cohorte.anneeScolaire}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Cursus</span>
              <span className={styles['card-text-primary']}>{cohorte.typeFormation}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Début</span>
              <span className={styles['card-text-primary']}>{cohorte.dateDebut?.slice(0,10) || '—'}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-text-secondary']}>Fin</span>
              <span className={styles['card-text-primary']}>{cohorte.dateFin?.slice(0,10) || '—'}</span>
            </div>
          </div>
        </div>
      </div>
      <Link to="/admin/cohortes" className={styles['card-button']}>← Retour</Link>
    </div>
  );
};
