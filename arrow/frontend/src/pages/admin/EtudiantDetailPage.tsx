import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, Phone, MapPin, Calendar, GraduationCap, TrendingUp, DollarSign, BookOpen, Award, AlertCircle, Target, MessageSquare, Tag } from 'lucide-react';
import { etudiantsService } from '../../services/etudiants';
import { Etudiant, StatutInscription, TypeFinancement } from '../../types/etudiant';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';

export const EtudiantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await etudiantsService.getById(id);
          setEtudiant(data);
        }
      } catch (e) {
        setError("Erreur lors du chargement de l'étudiant");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR');
  };

  const getStatutColor = (statut: StatutInscription) => {
    switch (statut) {
      case StatutInscription.INSCRIT:
      case StatutInscription.ADMIS:
        return '#10B981';
      case StatutInscription.EN_ATTENTE:
        return '#F59E0B';
      case StatutInscription.DIPLOME:
        return '#3B82F6';
      case StatutInscription.ABANDON:
      case StatutInscription.EXCLUS:
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800 }}>
          Chargement des informations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ padding: '1rem', background: 'rgba(220, 38, 38, 0.2)', border: '2px solid rgba(220, 38, 38, 0.5)', borderRadius: '12px', color: '#ff6b6b' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!etudiant) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 32px' }}>
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#87ceeb' }}>
          Étudiant introuvable
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header avec retour */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/admin/students" className={styles['card-button']} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Retour à la liste
        </Link>
        <Button
          onClick={() => {
            // TODO: Fonction d'édition
            window.location.href = `/admin/students`;
          }}
          className={styles['card-button']}
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            borderColor: '#f59e0b',
            color: '#f59e0b',
          }}
        >
          Modifier
        </Button>
      </div>

      {/* En-tête avec photo et infos principales */}
      <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none', marginBottom: '2rem' }}>
        <div className={styles['card-header']} style={{ flexDirection: 'row', alignItems: 'center', gap: '2rem' }}>
          {etudiant.photo ? (
            <img
              src={etudiant.photo}
              alt={`${etudiant.prenom} ${etudiant.nom}`}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '3px solid #3d9bff' }}
            />
          ) : (
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: 'rgba(61, 155, 255, 0.2)',
                color: '#3d9bff',
                border: '3px solid #3d9bff',
                fontSize: '1.5rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {etudiant.prenom?.charAt(0)?.toUpperCase()}{etudiant.nom?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 className={styles['card-title']} style={{ margin: 0, fontSize: '2rem', marginBottom: '0.5rem' }}>
              {etudiant.prenom} {etudiant.nom}
            </h1>
            {etudiant.numeroEtudiant && (
              <p className={styles['card-text-secondary']} style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                {etudiant.numeroEtudiant}
              </p>
            )}
            <Badge
              style={{
                background: `${getStatutColor(etudiant.statutInscription)}20`,
                color: getStatutColor(etudiant.statutInscription),
                border: `1px solid ${getStatutColor(etudiant.statutInscription)}60`,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }}
            >
              {etudiant.statutInscription}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Informations Personnelles</h2>
            </div>
            <div className={styles['card-section']}>
              <div className="space-y-4">
                <div className={styles['card-row']}>
                  <Mail size={18} style={{ color: '#87ceeb' }} />
                  <div style={{ flex: 1 }}>
                    <span className={styles['card-text-secondary']}>Email</span>
                    <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{etudiant.email}</span>
                  </div>
                </div>
                <div className={styles['card-row']}>
                  <Phone size={18} style={{ color: '#87ceeb' }} />
                  <div style={{ flex: 1 }}>
                    <span className={styles['card-text-secondary']}>Téléphone</span>
                    <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{etudiant.telephone}</span>
                  </div>
                </div>
                {etudiant.adresse && (
                  <div className={styles['card-row']}>
                    <MapPin size={18} style={{ color: '#87ceeb' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Adresse</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{etudiant.adresse}</span>
                    </div>
                  </div>
                )}
                {etudiant.dateNaissance && (
                  <div className={styles['card-row']}>
                    <Calendar size={18} style={{ color: '#87ceeb' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Date de naissance</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{formatDate(etudiant.dateNaissance)}</span>
                    </div>
                  </div>
                )}
                {etudiant.lieuNaissance && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Lieu de naissance</span>
                    <span className={styles['card-text-primary']}>{etudiant.lieuNaissance}</span>
                  </div>
                )}
                {etudiant.nationalite && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Nationalité</span>
                    <span className={styles['card-text-primary']}>{etudiant.nationalite}</span>
                  </div>
                )}
                {etudiant.genre && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Genre</span>
                    <span className={styles['card-text-primary']}>{etudiant.genre === 'M' ? 'Masculin' : etudiant.genre === 'F' ? 'Féminin' : 'Autre'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations scolaires */}
          <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Informations Scolaires</h2>
            </div>
            <div className={styles['card-section']}>
              <div className="space-y-4">
                {etudiant.formationSuivie && (
                  <div className={styles['card-row']}>
                    <GraduationCap size={18} style={{ color: '#87ceeb' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Formation</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{etudiant.formationSuivie}</span>
                    </div>
                  </div>
                )}
                {etudiant.niveau && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Niveau</span>
                    <span className={styles['card-text-primary']}>{etudiant.niveau}</span>
                  </div>
                )}
                {etudiant.dateInscription && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Date d'inscription</span>
                    <span className={styles['card-text-primary']}>{formatDate(etudiant.dateInscription)}</span>
                  </div>
                )}
                {etudiant.cohorteActuelle && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Cohorte actuelle</span>
                    <span className={styles['card-text-primary']}>
                      {typeof etudiant.cohorteActuelle === 'object' ? etudiant.cohorteActuelle.nom : etudiant.cohorteActuelle}
                    </span>
                  </div>
                )}
                {etudiant.cohortesHistorique && Array.isArray(etudiant.cohortesHistorique) && etudiant.cohortesHistorique.length > 0 && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Cohortes historiques</span>
                    <span className={styles['card-text-primary']}>
                      {etudiant.cohortesHistorique.map((c: any) => typeof c === 'object' ? c.nom : c).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financement */}
          {etudiant.typeFinancement && (
            <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
              <div className={styles['card-header']}>
                <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Financement</h2>
              </div>
              <div className={styles['card-section']}>
                <div className="space-y-4">
                  <div className={styles['card-row']}>
                    <DollarSign size={18} style={{ color: '#87ceeb' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Type</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>{etudiant.typeFinancement}</span>
                    </div>
                  </div>
                  {etudiant.montantFinancement && (
                    <div className={styles['card-row']}>
                      <span className={styles['card-text-secondary']}>Montant</span>
                      <span className={styles['card-text-primary']}>{etudiant.montantFinancement.toLocaleString('fr-FR')} €</span>
                    </div>
                  )}
                  {etudiant.organismeFinanceur && (
                    <div className={styles['card-row']}>
                      <span className={styles['card-text-secondary']}>Organisme</span>
                      <span className={styles['card-text-primary']}>{etudiant.organismeFinanceur}</span>
                    </div>
                  )}
                  {etudiant.dateDebutFinancement && (
                    <div className={styles['card-row']}>
                      <span className={styles['card-text-secondary']}>Début</span>
                      <span className={styles['card-text-primary']}>{formatDate(etudiant.dateDebutFinancement)}</span>
                    </div>
                  )}
                  {etudiant.dateFinFinancement && (
                    <div className={styles['card-row']}>
                      <span className={styles['card-text-secondary']}>Fin</span>
                      <span className={styles['card-text-primary']}>{formatDate(etudiant.dateFinFinancement)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          {/* Suivi pédagogique */}
          <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Suivi Pédagogique</h2>
            </div>
            <div className={styles['card-section']}>
              <div className="space-y-4">
                {etudiant.moyenneGenerale !== undefined && etudiant.moyenneGenerale > 0 && (
                  <div className={styles['card-row']}>
                    <Award size={18} style={{ color: '#87ceeb' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Moyenne générale</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {etudiant.moyenneGenerale.toFixed(2)}/20
                      </span>
                    </div>
                  </div>
                )}
                {etudiant.tauxPresence !== undefined && etudiant.tauxPresence > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={styles['card-text-secondary']}>Taux de présence</span>
                      <span className={styles['card-text-primary']} style={{ fontWeight: 'bold' }}>{etudiant.tauxPresence}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          background: `linear-gradient(90deg, #10B981, #10B981DD)`,
                          width: `${etudiant.tauxPresence}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {etudiant.tauxProgression !== undefined && etudiant.tauxProgression > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={styles['card-text-secondary']}>Taux de progression</span>
                      <span className={styles['card-text-primary']} style={{ fontWeight: 'bold' }}>{etudiant.tauxProgression}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          background: `linear-gradient(90deg, #3d9bff, #3d9bffDD)`,
                          width: `${etudiant.tauxProgression}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {etudiant.absences && etudiant.absences.length > 0 && (
                  <div className={styles['card-row']}>
                    <AlertCircle size={18} style={{ color: '#EF4444' }} />
                    <div style={{ flex: 1 }}>
                      <span className={styles['card-text-secondary']}>Absences</span>
                      <span className={styles['card-text-primary']} style={{ display: 'block', marginTop: '0.25rem' }}>
                        {etudiant.absences.length} absence(s)
                      </span>
                      <div className="mt-2">
                        {etudiant.absences.map((absence, idx) => (
                          <Badge key={idx} style={{ marginRight: '0.5rem', marginTop: '0.25rem', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid #EF4444' }}>
                            {formatDate(absence)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {etudiant.retards && etudiant.retards.length > 0 && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-text-secondary']}>Retards</span>
                    <span className={styles['card-text-primary']}>
                      {etudiant.retards.length} retard(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {etudiant.notes && etudiant.notes.length > 0 && (
            <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
              <div className={styles['card-header']}>
                <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Notes par Module</h2>
              </div>
              <div className={styles['card-section']}>
                <div className="space-y-3">
                  {etudiant.notes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(61,155,255,0.2)',
                        borderRadius: '8px',
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={styles['card-text-primary']} style={{ fontWeight: 'bold' }}>{note.module}</span>
                          <span className={styles['card-text-secondary']} style={{ display: 'block', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {formatDate(note.date)}
                          </span>
                        </div>
                        <Badge
                          style={{
                            background: note.note >= 16 ? 'rgba(16, 185, 129, 0.2)' : note.note >= 14 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: note.note >= 16 ? '#10B981' : note.note >= 14 ? '#3B82F6' : '#F59E0B',
                            border: `1px solid ${note.note >= 16 ? '#10B981' : note.note >= 14 ? '#3B82F6' : '#F59E0B'}`,
                            fontSize: '1rem',
                            padding: '0.5rem 1rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {note.note}/20
                        </Badge>
                      </div>
                      {note.commentaire && (
                        <p className={styles['card-text-secondary']} style={{ fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                          {note.commentaire}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {(etudiant.cv || etudiant.lettreMotivation || etudiant.diplomes || etudiant.piecesIdentite || etudiant.justificatifsFinancement) && (
            <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
              <div className={styles['card-header']}>
                <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Documents</h2>
              </div>
              <div className={styles['card-section']}>
                <div className="space-y-2">
                  {etudiant.cv && (
                    <div className={styles['card-row']}>
                      <FileText size={18} style={{ color: '#87ceeb' }} />
                      <a href={etudiant.cv} target="_blank" rel="noopener noreferrer" className={styles['card-text-primary']} style={{ textDecoration: 'underline' }}>
                        CV
                      </a>
                    </div>
                  )}
                  {etudiant.lettreMotivation && (
                    <div className={styles['card-row']}>
                      <FileText size={18} style={{ color: '#87ceeb' }} />
                      <a href={etudiant.lettreMotivation} target="_blank" rel="noopener noreferrer" className={styles['card-text-primary']} style={{ textDecoration: 'underline' }}>
                        Lettre de motivation
                      </a>
                    </div>
                  )}
                  {etudiant.diplomes && (
                    <div className={styles['card-row']}>
                      <FileText size={18} style={{ color: '#87ceeb' }} />
                      <span className={styles['card-text-primary']}>{etudiant.diplomes}</span>
                    </div>
                  )}
                  {etudiant.piecesIdentite && (
                    <div className={styles['card-row']}>
                      <FileText size={18} style={{ color: '#87ceeb' }} />
                      <a href={etudiant.piecesIdentite} target="_blank" rel="noopener noreferrer" className={styles['card-text-primary']} style={{ textDecoration: 'underline' }}>
                        Pièces d'identité
                      </a>
                    </div>
                  )}
                  {etudiant.justificatifsFinancement && (
                    <div className={styles['card-row']}>
                      <FileText size={18} style={{ color: '#87ceeb' }} />
                      <a href={etudiant.justificatifsFinancement} target="_blank" rel="noopener noreferrer" className={styles['card-text-primary']} style={{ textDecoration: 'underline' }}>
                        Justificatifs de financement
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Informations complémentaires */}
          {(etudiant.situationActuelle || etudiant.objectifs || etudiant.difficultesRencontrees || etudiant.commentaires) && (
            <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
              <div className={styles['card-header']}>
                <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Informations Complémentaires</h2>
              </div>
              <div className={styles['card-section']}>
                <div className="space-y-4">
                  {etudiant.situationActuelle && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} style={{ color: '#87ceeb' }} />
                        <span className={styles['card-text-secondary']} style={{ fontWeight: 'bold' }}>Situation actuelle</span>
                      </div>
                      <p className={styles['card-text-primary']} style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{etudiant.situationActuelle}</p>
                    </div>
                  )}
                  {etudiant.objectifs && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={18} style={{ color: '#87ceeb' }} />
                        <span className={styles['card-text-secondary']} style={{ fontWeight: 'bold' }}>Objectifs</span>
                      </div>
                      <p className={styles['card-text-primary']} style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{etudiant.objectifs}</p>
                    </div>
                  )}
                  {etudiant.difficultesRencontrees && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} style={{ color: '#F59E0B' }} />
                        <span className={styles['card-text-secondary']} style={{ fontWeight: 'bold' }}>Difficultés rencontrées</span>
                      </div>
                      <p className={styles['card-text-primary']} style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{etudiant.difficultesRencontrees}</p>
                    </div>
                  )}
                  {etudiant.commentaires && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={18} style={{ color: '#87ceeb' }} />
                        <span className={styles['card-text-secondary']} style={{ fontWeight: 'bold' }}>Commentaires</span>
                      </div>
                      <p className={styles['card-text-primary']} style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{etudiant.commentaires}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {etudiant.tags && etudiant.tags.length > 0 && (
            <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', boxShadow: 'none' }}>
              <div className={styles['card-header']}>
                <h2 className={styles['card-title']} style={{ margin: 0, fontSize: '1.25rem' }}>Tags</h2>
              </div>
              <div className={styles['card-section']}>
                <div className="flex flex-wrap gap-2">
                  {etudiant.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      style={{
                        background: 'rgba(61, 155, 255, 0.2)',
                        color: '#3d9bff',
                        border: '1px solid rgba(61, 155, 255, 0.4)',
                        padding: '0.5rem 1rem',
                      }}
                    >
                      <Tag size={14} style={{ marginRight: '0.25rem', display: 'inline-block' }} />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
