import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { attendanceService, AttendanceStatus, CreateAttendanceDto } from '../../services/attendance';
import { uploadsService } from '../../services/uploads';
import { etudiantsService } from '../../services/etudiants';
import { cohortesService } from '../../services/cohortes';
import { Etudiant } from '../../types/etudiant';
import { Cohorte } from '../../types/cohorte';
import { cn } from '@/lib/utils';
import styles from '@/components/admin/cards.module.css';

interface Session {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  cohorteId?: string;
  intervenantId?: string;
}

interface AttendanceRecord {
  _id?: string;
  etudiantId: string;
  sessionId: string;
  status: AttendanceStatus;
  justificatifDocId?: string;
  commentaire?: string;
  etudiant?: Etudiant;
}

export const CallsPage: React.FC = () => {
  const [selectedCohorte, setSelectedCohorte] = useState<string>('');
  const [cohortes, setCohortes] = useState<Cohorte[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCohortes();
  }, []);

  useEffect(() => {
    if (selectedCohorte) {
      loadEtudiants(selectedCohorte);
      // TODO: Load sessions for this cohorte
      // loadSessions(selectedCohorte);
    }
  }, [selectedCohorte]);

  useEffect(() => {
    if (selectedSession) {
      loadAttendances(selectedSession);
    }
  }, [selectedSession]);

  const loadCohortes = async () => {
    try {
      const data = await cohortesService.getAll();
      setCohortes(data);
    } catch (err) {
      console.error('Erreur chargement cohortes:', err);
    }
  };

  const loadEtudiants = async (cohorteId: string) => {
    try {
      const data = await etudiantsService.getAll(cohorteId);
      setEtudiants(data);
      // Initialiser les présences pour la session sélectionnée
      if (selectedSession) {
        initializeAttendances(data, selectedSession);
      }
    } catch (err) {
      console.error('Erreur chargement étudiants:', err);
    }
  };

  const loadAttendances = async (sessionId: string) => {
    try {
      setLoading(true);
      const data = await attendanceService.getBySession(sessionId);
      const enriched = await Promise.all(
        data.map(async (att) => ({
          ...att,
          etudiant: etudiants.find((e) => e._id === att.etudiantId),
        }))
      );
      setAttendances(enriched);
    } catch (err) {
      console.error('Erreur chargement présences:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeAttendances = (students: Etudiant[], sessionId: string) => {
    const newAttendances: AttendanceRecord[] = students.map((etudiant) => ({
      etudiantId: etudiant._id,
      sessionId,
      status: AttendanceStatus.ABSENT,
      etudiant,
    }));
    setAttendances(newAttendances);
  };

  const updateAttendance = async (etudiantId: string, status: AttendanceStatus) => {
    if (!selectedSession) return;

    const existing = attendances.find((a) => a.etudiantId === etudiantId);
    const payload: CreateAttendanceDto = {
      etudiantId,
      sessionId: selectedSession,
      status,
    };

    try {
      const updated = await attendanceService.upsertOne(payload);
      setAttendances((prev) =>
        prev.map((a) => (a.etudiantId === etudiantId ? { ...updated, etudiant: a.etudiant } : a))
      );
    } catch (err) {
      console.error('Erreur mise à jour présence:', err);
    }
  };

  const handleFileUpload = async (files: FileList | null, type: 'emargement' | 'justificatif', etudiantId?: string) => {
    if (!files || files.length === 0 || !selectedSession) return;

    try {
      setUploading(true);
      const fileArray = Array.from(files);
      if (type === 'emargement') {
        await uploadsService.uploadEmargements(selectedSession, fileArray);
      } else {
        await uploadsService.uploadJustificatifs(selectedSession, fileArray, etudiantId);
      }
      alert(`${type === 'emargement' ? 'Émargement' : 'Justificatif'} uploadé avec succès`);
    } catch (err) {
      console.error('Erreur upload:', err);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const stats = React.useMemo(() => {
    const total = attendances.length;
    const present = attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    const absent = attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;
    const retard = attendances.filter((a) => a.status === AttendanceStatus.RETARD).length;
    const taux = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, retard, taux };
  }, [attendances]);

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header - Centre de contrôle */}
      <div className="flex items-center justify-between mb-6" style={{
        background: 'rgba(0,0,0,0.5)',
        border: '2px solid rgba(61,155,255,0.25)',
        borderRadius: '12px',
        padding: '1rem 1.25rem'
      }}>
        <h1 className="text-2xl md:text-3xl font-black tracking-[0.12em] uppercase" style={{
          background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>Centre de contrôle présences</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" style={{ color: '#87ceeb', borderColor: 'rgba(61,155,255,0.35)' }}>{new Date().toLocaleDateString('fr-FR')}</Button>
          <Button size="sm" style={{ background: 'rgba(61,155,255,0.2)', border: '2px solid rgba(61,155,255,0.45)', color: '#cfeaff' }}>Exporter</Button>
        </div>
      </div>

      {/* Filtres */}
      <div className={cn(styles['base-card'], styles['card-spacing-normal'])} style={{ borderTop: '4px solid #3d9bff', marginBottom: '2rem' }}>
        <div className={styles['card-header']}>
          <h2 className={styles['card-title']} style={{ margin: 0 }}>Sélection</h2>
        </div>
        <div className={styles['card-section']}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Cohorte</Label>
              <Select value={selectedCohorte} onValueChange={setSelectedCohorte}>
                <SelectTrigger className="uppercase tracking-[0.05em] h-14"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#87ceeb'
                  }}
                >
                  <SelectValue placeholder="Sélectionner une cohorte" />
                </SelectTrigger>
                <SelectContent>
                  {cohortes.map((cohorte) => (
                    <SelectItem key={cohorte._id} value={cohorte._id}>{cohorte.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Session</Label>
              <Select value={selectedSession} onValueChange={(v) => { setSelectedSession(v); initializeAttendances(etudiants, v); }}>
                <SelectTrigger className="uppercase tracking-[0.05em] h-14"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(61,155,255,0.35)',
                    color: '#87ceeb'
                  }}
                >
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Populate with real sessions */}
                  <SelectItem value="session1">Session du {new Date().toLocaleDateString('fr-FR')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets principaux */}
      {selectedSession && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Live maintenant */}
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)' }}>
            <CardHeader>
              <CardTitle>Live maintenant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="h-2 rounded-full animate-pulse" style={{ width: `${stats.taux}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
              </div>
              <div style={{ color: '#87ceeb' }}>{stats.present}/{stats.total} présents</div>
              <div className="mt-2">
                <Button size="sm" style={{ background: 'rgba(61,155,255,0.2)', border: '2px solid rgba(61,155,255,0.45)', color: '#cfeaff' }}>
                  Ouvrir l'appel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats jour */}
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)' }}>
            <CardHeader>
              <CardTitle>Stats jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold" style={{ color: stats.taux >= 80 ? '#10B981' : stats.taux >= 60 ? '#F59E0B' : '#EF4444' }}>{stats.taux}%</div>
              <div className="h-10 mt-3" style={{ background: 'linear-gradient(90deg, rgba(61,155,255,0.15) 25%, rgba(61,155,255,0.35) 50%, rgba(61,155,255,0.15) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)' }}>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">SMS groupé</Button>
              <Button variant="outline" size="sm">Feuille</Button>
              <Button variant="outline" size="sm">Rappels</Button>
              <Button variant="outline" size="sm">QR Code</Button>
              <Button variant="outline" size="sm">Justifs</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions Upload */}
      {selectedSession && (
        <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h3 className={styles['card-title']} style={{ margin: 0 }}>Actions</h3>
          </div>
          <div className={styles['card-section']}>
            <div className="flex gap-4">
              <Label htmlFor="emargement-upload" className={styles['card-button']} style={{ cursor: 'pointer' }}>
                <Upload className="mr-2 h-4 w-4" />
                Uploader émargement
              </Label>
              <input
                id="emargement-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files, 'emargement')}
                disabled={uploading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Appel rapide (grille interactive) */}
      {selectedSession && etudiants.length > 0 && (
        <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff', marginBottom: '2rem' }}>
          <div className={styles['card-header']}>
            <h3 className={styles['card-title']} style={{ margin: 0 }}>Appel rapide</h3>
          </div>
          <div className={styles['card-section']}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {etudiants.map((etudiant) => {
                const attendance = attendances.find((a) => a.etudiantId === etudiant._id);
                const status = attendance?.status || AttendanceStatus.ABSENT;
                const border = status === AttendanceStatus.PRESENT ? '#10B981' : status === AttendanceStatus.RETARD ? '#F59E0B' : '#EF4444';
                return (
                  <button
                    key={etudiant._id}
                    onClick={() => updateAttendance(etudiant._id, status === AttendanceStatus.PRESENT ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT)}
                    className="rounded-lg p-3 text-left transition-transform"
                    style={{ border: `2px solid ${border}`, background: 'rgba(0,0,0,0.35)' }}
                  >
                    <div className="font-semibold" style={{ color: '#cfeaff' }}>{etudiant.prenom} {etudiant.nom}</div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>{status}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => attendances.forEach(a => updateAttendance(a.etudiantId, AttendanceStatus.PRESENT))}>Tous présents</Button>
              <Button size="sm" variant="outline" onClick={() => attendances.forEach(a => updateAttendance(a.etudiantId, AttendanceStatus.ABSENT))}>Tous absents</Button>
            </div>
          </div>
        </div>
      )}

      {/* Feuille d'émargement */}
      {selectedSession && etudiants.length > 0 && (
        <div className={cn(styles['base-card'])} style={{ borderTop: '4px solid #3d9bff' }}>
          <div className={styles['card-header']}>
            <h3 className={styles['card-title']} style={{ margin: 0 }}>Feuille d'émargement</h3>
          </div>
          <div className={styles['card-section']}>
            <div className="space-y-2">
              {etudiants.map((etudiant) => {
                const attendance = attendances.find((a) => a.etudiantId === etudiant._id);
                const status = attendance?.status || AttendanceStatus.ABSENT;

                return (
                  <div
                    key={etudiant._id}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(61,155,255,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-semibold" style={{ color: '#87ceeb', minWidth: '200px' }}>
                        {etudiant.prenom} {etudiant.nom}
                      </span>
                      {etudiant.numeroEtudiant && (
                        <span className="text-sm text-gray-400">{etudiant.numeroEtudiant}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={status === AttendanceStatus.PRESENT ? 'default' : 'outline'}
                        onClick={() => updateAttendance(etudiant._id, AttendanceStatus.PRESENT)}
                        style={{
                          background: status === AttendanceStatus.PRESENT ? '#10B981' : 'transparent',
                          borderColor: status === AttendanceStatus.PRESENT ? '#10B981' : 'rgba(255,255,255,0.2)',
                          color: status === AttendanceStatus.PRESENT ? 'white' : '#87ceeb',
                        }}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Présent
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={status === AttendanceStatus.RETARD ? 'default' : 'outline'}
                        onClick={() => updateAttendance(etudiant._id, AttendanceStatus.RETARD)}
                        style={{
                          background: status === AttendanceStatus.RETARD ? '#F59E0B' : 'transparent',
                          borderColor: status === AttendanceStatus.RETARD ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                          color: status === AttendanceStatus.RETARD ? 'white' : '#87ceeb',
                        }}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Retard
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={status === AttendanceStatus.ABSENT ? 'default' : 'outline'}
                        onClick={() => updateAttendance(etudiant._id, AttendanceStatus.ABSENT)}
                        style={{
                          background: status === AttendanceStatus.ABSENT ? '#EF4444' : 'transparent',
                          borderColor: status === AttendanceStatus.ABSENT ? '#EF4444' : 'rgba(255,255,255,0.2)',
                          color: status === AttendanceStatus.ABSENT ? 'white' : '#87ceeb',
                        }}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Absent
                      </Button>

                      <Label htmlFor={`justificatif-${etudiant._id}`} className={styles['card-button']} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>
                        <FileText className="mr-1 h-4 w-4" />
                        Justificatif
                      </Label>
                      <input
                        id={`justificatif-${etudiant._id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'justificatif', etudiant._id)}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selectedCohorte && (
        <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)', textAlign: 'center', padding: '3rem' }}>
          <CardContent>
            <p className="text-lg font-bold uppercase tracking-[0.08em]" style={{ color: '#87ceeb' }}>
              Sélectionnez une cohorte pour commencer
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

