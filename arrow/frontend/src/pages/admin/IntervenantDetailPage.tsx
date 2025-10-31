import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Intervenant } from '../../types/intervenant';
import { intervenantsService } from '../../services/intervenants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IntervenantDetailPage: React.FC = () => {
  const { id } = useParams();
  const [intervenant, setIntervenant] = useState<Intervenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInactive, setIsInactive] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) return;
        const data = await intervenantsService.getOne(id);
        setIntervenant(data);
      } catch (e) {
        setError('Impossible de charger les informations de l\'intervenant');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Lecture/écriture état local (inactif/archivé)
  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem('intervenant_state');
      const state = raw ? JSON.parse(raw) : {};
      const s = state[id] || {};
      setIsInactive(!!s.inactive);
      setIsArchived(!!s.archived);
    } catch {}
  }, [id]);

  const saveState = (next: { inactive?: boolean; archived?: boolean }) => {
    if (!id) return;
    const raw = localStorage.getItem('intervenant_state');
    const state = raw ? JSON.parse(raw) : {};
    state[id] = { ...(state[id] || {}), ...next };
    localStorage.setItem('intervenant_state', JSON.stringify(state));
  };

  const beginEdit = () => {
    if (!intervenant) return;
    setForm({
      email: intervenant.email || '',
      telephone: intervenant.telephone || '',
      adresse: intervenant.adresse || '',
      poste: intervenant.poste || '',
      statut: intervenant.statut || '',
      experience: (intervenant as any).experience ?? '',
      domainesExpertise: intervenant.domainesExpertise?.join('\n') || '',
      modulesEnseignes: intervenant.modulesEnseignes?.join('\n') || '',
      typeContrat: intervenant.typeContrat || '',
      dateDebutMission: intervenant.dateDebutMission ? new Date(intervenant.dateDebutMission).toISOString().slice(0,10) : '',
      dateFinMission: intervenant.dateFinMission ? new Date(intervenant.dateFinMission).toISOString().slice(0,10) : '',
      tarification: intervenant.tarification || '',
      heuresPrevues: intervenant.heuresPrevues ?? '',
      heuresParModule: intervenant.heuresParModule ?? '',
      niveauEtudiants: intervenant.niveauEtudiants || '',
      cv: intervenant.cv || '',
      diplomes: intervenant.diplomes || '',
      supportsPedagogiques: intervenant.supportsPedagogiques || '',
      methodesPedagogiques: intervenant.methodesPedagogiques || '',
      pieceIdentite: intervenant.pieceIdentite || '',
      numeroSiret: intervenant.numeroSiret || '',
      assuranceRC: intervenant.assuranceRC || '',
      extraitKbis: intervenant.extraitKbis || '',
      justificatifsDiplomes: intervenant.justificatifsDiplomes || '',
      conventionContrat: intervenant.conventionContrat || '',
      attestationURSSAF: intervenant.attestationURSSAF || '',
      appreciationsEtudiants: intervenant.appreciationsEtudiants?.join('\n') || '',
      feedbackResponsables: intervenant.feedbackResponsables?.join('\n') || '',
      pointsAmelioration: intervenant.pointsAmelioration || '',
      disponibilites: intervenant.disponibilites || '',
      engagement: intervenant.engagement || '',
    });
    setIsEditing(true);
  };

  const updateField = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const saveEdit = async () => {
    if (!id) return;
    const payload: any = {
      email: form.email || undefined,
      telephone: form.telephone || undefined,
      adresse: form.adresse || undefined,
      poste: form.poste || undefined,
      statut: form.statut || undefined,
      experience: form.experience || undefined,
      domainesExpertise: form.domainesExpertise ? String(form.domainesExpertise).split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : undefined,
      modulesEnseignes: form.modulesEnseignes ? String(form.modulesEnseignes).split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : undefined,
      typeContrat: form.typeContrat || undefined,
      dateDebutMission: form.dateDebutMission ? new Date(form.dateDebutMission) : undefined,
      dateFinMission: form.dateFinMission ? new Date(form.dateFinMission) : undefined,
      tarification: form.tarification || undefined,
      heuresPrevues: form.heuresPrevues === '' ? undefined : Number(form.heuresPrevues),
      heuresParModule: form.heuresParModule === '' ? undefined : Number(form.heuresParModule),
      niveauEtudiants: form.niveauEtudiants || undefined,
      cv: form.cv || undefined,
      diplomes: form.diplomes || undefined,
      supportsPedagogiques: form.supportsPedagogiques || undefined,
      methodesPedagogiques: form.methodesPedagogiques || undefined,
      pieceIdentite: form.pieceIdentite || undefined,
      numeroSiret: form.numeroSiret || undefined,
      assuranceRC: form.assuranceRC || undefined,
      extraitKbis: form.extraitKbis || undefined,
      justificatifsDiplomes: form.justificatifsDiplomes || undefined,
      conventionContrat: form.conventionContrat || undefined,
      attestationURSSAF: form.attestationURSSAF || undefined,
      appreciationsEtudiants: form.appreciationsEtudiants ? String(form.appreciationsEtudiants).split(/\r?\n/).map((s)=>s.trim()).filter(Boolean) : undefined,
      feedbackResponsables: form.feedbackResponsables ? String(form.feedbackResponsables).split(/\r?\n/).map((s)=>s.trim()).filter(Boolean) : undefined,
      pointsAmelioration: form.pointsAmelioration || undefined,
      disponibilites: form.disponibilites || undefined,
      engagement: form.engagement || undefined,
    };
    await intervenantsService.update(id, payload);
    const refreshed = await intervenantsService.getOne(id);
    setIntervenant(refreshed);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-[3px] border-muted border-t-primary rounded-full animate-spin" />
          <p className="mt-2 text-muted-foreground">Chargement…</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !intervenant) {
    return (
      <MainLayout>
        <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className={cn(styles['base-card'])}>
            <p className="text-red-500">{error || 'Intervenant introuvable'}</p>
            <div className="mt-4">
              <Link to="/admin/intervenant-list"><Button>Retour</Button></Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const neonPalette = ['#3D9BFF', '#FF5ACD', '#7CFF5A', '#FFC857', '#9B5DFF', '#00E5FF'];
  const computeStableIndex = (key: string) => {
    let acc = 0; for (let i = 0; i < key.length; i++) acc = (acc * 31 + key.charCodeAt(i)) >>> 0; return acc % neonPalette.length;
  };
  const neon = neonPalette[computeStableIndex(intervenant._id || intervenant.nom || 'neon')];
  const randomIndex = Math.floor(Math.random() * neonPalette.length);
  const h1Neon = neonPalette[randomIndex];
  const subtitleNeon = neonPalette[(randomIndex + 2) % neonPalette.length];

  return (
    <MainLayout>
      <div className="mx-auto px-4 md:px-8 edge-mobile-container" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="flex items-end gap-4 mb-8 flex-wrap">
          <h1 className="tracking-[0.18em] uppercase m-0" style={{
            fontWeight: 900,
            color: h1Neon,
            textShadow: `0 0 18px ${h1Neon}66, 0 0 32px ${h1Neon}33`,
            letterSpacing: '0.18em',
            fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
            lineHeight: 1.2
          }}>Fiche Intervenant</h1>
          <span className="inline-flex items-center rounded-full border text-xs font-semibold px-3 py-1" style={{ background: 'rgba(61,155,255,0.10)', borderColor: 'rgba(61,155,255,0.35)', color: '#87ceeb' }}>#{intervenant._id?.slice(-6)}</span>
        </div>

        <div className={cn(styles['base-card'], styles['no-mobile-shrink'], styles['edge-mobile'], styles['card-neon'], styles['card-infos'], styles['card-large'], styles['card-spacing-large'])} style={{ borderTop: `4px solid ${neon}`, boxShadow: 'none', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className={styles['card-header']} style={{ background: 'rgba(61,155,255,0.06)', padding: '0.75rem 1rem', borderLeft: `4px solid ${neon}`, borderRadius: '8px' }}>
            <h2 className={styles['card-title']} style={{ margin: 0, color: h1Neon, fontWeight: 900, textShadow: `0 0 14px ${h1Neon}55` }}>{intervenant.prenom} {intervenant.nom}</h2>
            <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>{intervenant.poste} • {intervenant.statut}</p>
          </div>
          <div className={styles['card-infos__meta']}>
            <span><strong>ID:</strong> <span className={styles['card-infos__mono']}>{intervenant._id}</span></span>
            {intervenant.dateCreation && (<span><strong>Créé:</strong> {new Date(intervenant.dateCreation).toLocaleString('fr-FR')}</span>)}
            {intervenant.dateModification && (<span><strong>Modifié:</strong> {new Date(intervenant.dateModification).toLocaleString('fr-FR')}</span>)}
          </div>

          {/* Espace dédié pour le toggle actif/inactif */}
          <div className={styles['card-section']}>
            <div className={styles['card-field-block']} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div className="flex items-center gap-3">
                <label className="neon-toggle" style={{ minWidth: 240 }}>
                  <input
                    type="checkbox"
                    checked={!isInactive}
                    onChange={(e) => {
                      const active = e.target.checked;
                      setIsInactive(!active);
                      saveState({ inactive: !active });
                    }}
                  />
                  <span className="switch">
                    <span className="knob" />
                  </span>
                  <span className={styles['card-text-secondary']}>
                    {isInactive ? 'Profil inactif (grisé en liste)' : 'Profil actif'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Informations générales</h3>
            <div className={styles['card-infos__kv']}>
              <div className={styles['card-infos__key']}>Email</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                ) : (intervenant.email || '—')}
              </div>
              <div className={styles['card-infos__key']}>Téléphone</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.telephone} onChange={(e) => updateField('telephone', e.target.value)} />
                ) : (intervenant.telephone || '—')}
              </div>
              <div className={styles['card-infos__key']}>Adresse</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.adresse} onChange={(e) => updateField('adresse', e.target.value)} />
                ) : (intervenant.adresse || '—')}
              </div>
              <div className={styles['card-infos__key']}>Date de naissance</div>
              <div className={styles['card-infos__value']}>{intervenant.dateNaissance ? new Date(intervenant.dateNaissance).toLocaleDateString('fr-FR') : '—'}</div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Informations professionnelles</h3>
            <div className={styles['card-infos__kv']}>
              <div className={styles['card-infos__key']}>Poste</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.poste} onChange={(e) => updateField('poste', e.target.value)} />
                ) : (intervenant.poste || '—')}
              </div>
              <div className={styles['card-infos__key']}>Statut</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.statut} onChange={(e) => updateField('statut', e.target.value)} />
                ) : (intervenant.statut || '—')}
              </div>
              <div className={styles['card-infos__key']}>Expérience</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.experience} onChange={(e) => updateField('experience', e.target.value)} />
                ) : ((intervenant as any).experience ?? '—')}
              </div>
              <div className={styles['card-infos__key']}>Domaines d'expertise</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <textarea rows={4} placeholder="Un domaine par ligne" value={form.domainesExpertise} onChange={(e) => updateField('domainesExpertise', e.target.value)} style={{ width: '100%', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#cfeaff', borderRadius: 8, padding: 10 }} />
                ) : (
                  intervenant.domainesExpertise?.length ? (
                    <div className={styles['card-infos__chiplist']}>
                      {intervenant.domainesExpertise.map((d, i) => (<span key={i}>{d}</span>))}
                    </div>
                  ) : '—'
                )}
              </div>
              <div className={styles['card-infos__key']}>Diplômes</div>
              <div className={styles['card-infos__value']}>{intervenant.diplomes || '—'}</div>
              <div className={styles['card-infos__key']}>CV</div>
              <div className={styles['card-infos__value']}>{intervenant.cv ? <a className={styles['card-infos__link']} href={intervenant.cv} target="_blank" rel="noreferrer">Ouvrir</a> : '—'}</div>
            </div>
          </div>

          {/* Données contractuelles */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Données contractuelles</h3>
            <div className={styles['card-infos__kv']}>
              <div className={styles['card-infos__key']}>Type de contrat</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.typeContrat} onChange={(e) => updateField('typeContrat', e.target.value)} />
                ) : (intervenant.typeContrat || '—')}
              </div>
              <div className={styles['card-infos__key']}>Début de mission</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input type="date" value={form.dateDebutMission} onChange={(e) => updateField('dateDebutMission', e.target.value)} />
                ) : (intervenant.dateDebutMission ? new Date(intervenant.dateDebutMission).toLocaleDateString('fr-FR') : '—')}
              </div>
              <div className={styles['card-infos__key']}>Fin de mission</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input type="date" value={form.dateFinMission} onChange={(e) => updateField('dateFinMission', e.target.value)} />
                ) : (intervenant.dateFinMission ? new Date(intervenant.dateFinMission).toLocaleDateString('fr-FR') : '—')}
              </div>
              <div className={styles['card-infos__key']}>Tarification</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.tarification} onChange={(e) => updateField('tarification', e.target.value)} />
                ) : (intervenant.tarification || '—')}
              </div>
              <div className={styles['card-infos__key']}>Heures prévues</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input type="number" value={form.heuresPrevues} onChange={(e) => updateField('heuresPrevues', e.target.value)} />
                ) : (intervenant.heuresPrevues ?? '—')}
              </div>
              <div className={styles['card-infos__key']}>RIB</div>
              <div className={cn(styles['card-infos__value'], styles['card-infos__mono'])}>{intervenant.rib || '—'}</div>
              <div className={styles['card-infos__key']}>Clauses</div>
              <div className={styles['card-infos__value']}>{intervenant.clauses || '—'}</div>
            </div>
          </div>

          {/* Informations pédagogiques */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Informations pédagogiques</h3>
            <div className={styles['card-infos__kv']}>
              <div className={styles['card-infos__key']}>Modules enseignés</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <textarea rows={4} placeholder="Un module par ligne" value={form.modulesEnseignes} onChange={(e) => updateField('modulesEnseignes', e.target.value)} style={{ width: '100%', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#cfeaff', borderRadius: 8, padding: 10 }} />
                ) : (
                  intervenant.modulesEnseignes?.length ? (
                    <div className={styles['card-infos__chiplist']}>
                      {intervenant.modulesEnseignes.map((m, i) => (<span key={i}>{m}</span>))}
                    </div>
                  ) : '—'
                )}
              </div>
              <div className={styles['card-infos__key']}>Heures par module</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input type="number" value={form.heuresParModule} onChange={(e) => updateField('heuresParModule', e.target.value)} />
                ) : (intervenant.heuresParModule ?? '—')}
              </div>
              <div className={styles['card-infos__key']}>Niveau des étudiants</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.niveauEtudiants} onChange={(e) => updateField('niveauEtudiants', e.target.value)} />
                ) : (intervenant.niveauEtudiants || '—')}
              </div>
              <div className={styles['card-infos__key']}>Supports</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.supportsPedagogiques} onChange={(e) => updateField('supportsPedagogiques', e.target.value)} placeholder="URL vers les supports" />
                ) : (intervenant.supportsPedagogiques ? <a className={styles['card-infos__link']} href={intervenant.supportsPedagogiques} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Méthodes</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.methodesPedagogiques} onChange={(e) => updateField('methodesPedagogiques', e.target.value)} />
                ) : (intervenant.methodesPedagogiques || '—')}
              </div>
            </div>
          </div>

          {/* Documents administratifs */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Documents administratifs</h3>
            <div className={styles['card-infos__kv']}>
              <div className={styles['card-infos__key']}>Pièce d'identité</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.pieceIdentite} onChange={(e) => updateField('pieceIdentite', e.target.value)} placeholder="URL vers la pièce d'identité" />
                ) : (intervenant.pieceIdentite ? <a className={styles['card-infos__link']} href={intervenant.pieceIdentite} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Numéro SIRET</div>
              <div className={cn(styles['card-infos__value'], styles['card-infos__mono'])}>
                {isEditing ? (
                  <Input value={form.numeroSiret} onChange={(e) => updateField('numeroSiret', e.target.value)} />
                ) : (intervenant.numeroSiret || '—')}
              </div>
              <div className={styles['card-infos__key']}>Assurance RC</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.assuranceRC} onChange={(e) => updateField('assuranceRC', e.target.value)} placeholder="URL Assurance RC" />
                ) : (intervenant.assuranceRC ? <a className={styles['card-infos__link']} href={intervenant.assuranceRC} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Extrait Kbis</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.extraitKbis} onChange={(e) => updateField('extraitKbis', e.target.value)} placeholder="URL Kbis" />
                ) : (intervenant.extraitKbis ? <a className={styles['card-infos__link']} href={intervenant.extraitKbis} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Justificatifs diplômes</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.justificatifsDiplomes} onChange={(e) => updateField('justificatifsDiplomes', e.target.value)} placeholder="URL justificatifs diplômes" />
                ) : (intervenant.justificatifsDiplomes ? <a className={styles['card-infos__link']} href={intervenant.justificatifsDiplomes} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Convention/Contrat</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.conventionContrat} onChange={(e) => updateField('conventionContrat', e.target.value)} placeholder="URL convention/contrat" />
                ) : (intervenant.conventionContrat ? <a className={styles['card-infos__link']} href={intervenant.conventionContrat} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
              <div className={styles['card-infos__key']}>Attestation URSSAF</div>
              <div className={styles['card-infos__value']}>
                {isEditing ? (
                  <Input value={form.attestationURSSAF} onChange={(e) => updateField('attestationURSSAF', e.target.value)} placeholder="URL attestation URSSAF" />
                ) : (intervenant.attestationURSSAF ? <a className={styles['card-infos__link']} href={intervenant.attestationURSSAF} target="_blank" rel="noreferrer">Ouvrir</a> : '—')}
              </div>
            </div>
          </div>

          {/* Suivi et évaluation */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-infos__subtitle']} style={{ color: subtitleNeon, borderLeft: `4px solid ${subtitleNeon}`, paddingLeft: '0.5rem' }}>Suivi et évaluation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={styles['card-infos__key']} style={{ marginBottom: '0.25rem' }}>Appréciations étudiants</p>
                {!isEditing ? (
                  <ul className="list-disc pl-5 m-0">
                    {intervenant.appreciationsEtudiants?.length ? intervenant.appreciationsEtudiants.map((a, i) => (
                      <li key={i} className={styles['card-infos__value']}>{a}</li>
                    )) : <li className={styles['card-text-secondary']}>—</li>}
                  </ul>
                ) : (
                  <textarea rows={4} placeholder="Une appréciation par ligne" value={form.appreciationsEtudiants} onChange={(e) => updateField('appreciationsEtudiants', e.target.value)} style={{ width: '100%', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#cfeaff', borderRadius: 8, padding: 10 }} />
                )}
              </div>
              <div>
                <p className={styles['card-infos__key']} style={{ marginBottom: '0.25rem' }}>Feedback responsables</p>
                {!isEditing ? (
                  <ul className="list-disc pl-5 m-0">
                    {intervenant.feedbackResponsables?.length ? intervenant.feedbackResponsables.map((f, i) => (
                      <li key={i} className={styles['card-infos__value']}>{f}</li>
                    )) : <li className={styles['card-text-secondary']}>—</li>}
                  </ul>
                ) : (
                  <textarea rows={4} placeholder="Un feedback par ligne" value={form.feedbackResponsables} onChange={(e) => updateField('feedbackResponsables', e.target.value)} style={{ width: '100%', background: 'rgba(17,24,39,0.6)', border: '2px solid rgba(61,155,255,0.35)', color: '#cfeaff', borderRadius: 8, padding: 10 }} />
                )}
              </div>
              <div className={styles['card-infos__kv']} style={{ gridColumn: '1 / -1' }}>
                <div className={styles['card-infos__key']}>Points d'amélioration</div>
                <div className={styles['card-infos__value']}>
                  {isEditing ? (
                    <Input value={form.pointsAmelioration} onChange={(e) => updateField('pointsAmelioration', e.target.value)} />
                  ) : (intervenant.pointsAmelioration || '—')}
                </div>
                <div className={styles['card-infos__key']}>Disponibilités</div>
                <div className={styles['card-infos__value']}>
                  {isEditing ? (
                    <Input value={form.disponibilites} onChange={(e) => updateField('disponibilites', e.target.value)} />
                  ) : (intervenant.disponibilites || '—')}
                </div>
                <div className={styles['card-infos__key']}>Engagement</div>
                <div className={styles['card-infos__value']}>
                  {isEditing ? (
                    <Input value={form.engagement} onChange={(e) => updateField('engagement', e.target.value)} />
                  ) : (intervenant.engagement || '—')}
                </div>
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className={styles['card-section']}>
            <h3 className={styles['card-title']} style={{ fontSize: '1rem' }}>Métadonnées</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <p className={styles['card-text-secondary']}><strong>ID:</strong> {intervenant._id}</p>
              <p className={styles['card-text-secondary']}><strong>Création:</strong> {intervenant.dateCreation ? new Date(intervenant.dateCreation).toLocaleString('fr-FR') : '—'}</p>
              <p className={styles['card-text-secondary']}><strong>Modification:</strong> {intervenant.dateModification ? new Date(intervenant.dateModification).toLocaleString('fr-FR') : '—'}</p>
            </div>
          </div>

          <div className={styles['card-footer']}>
            {!isEditing ? (
              <Button className="Add-button" onClick={beginEdit}>Modifier</Button>
            ) : (
              <>
                <Button className="Add-button" onClick={saveEdit}>Enregistrer</Button>
                <Button className="Add-button--ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
              </>
            )}
            {!isEditing && (
              <Button
                className="Add-button"
                onClick={() => {
                  if (!id) return;
                  const confirmArchive = window.confirm('Archiver ce profil ? Il sera retiré de la liste.');
                  if (!confirmArchive) return;
                  setIsArchived(true);
                  saveState({ archived: true });
                  window.location.href = '/admin/intervenant-list';
                }}
              >
                Archiver
              </Button>
            )}
            <Link to="/admin/intervenant-list"><Button className="Add-button">Retour</Button></Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IntervenantDetailPage;


