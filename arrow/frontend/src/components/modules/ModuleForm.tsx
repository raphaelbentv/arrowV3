import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { ModuleCours, EvaluationType } from '../../types/module';
import { cn } from '@/lib/utils';
import styles from '../admin/cards.module.css';

// Composant Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

interface ModuleFormProps {
  module?: ModuleCours;
  onSubmit: (data: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onDeleteModule?: (id: string) => Promise<void>;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  module,
  onSubmit,
  onCancel,
  isLoading = false,
  onDeleteModule,
}) => {
  const [formData, setFormData] = useState<Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'>>({
    nom: '',
    code: '',
    descriptionCourte: '',
    nombreHeuresTotal: undefined,
    coefficient: undefined,
    intervenantPrincipalId: undefined,
    semestre: '',
    typeEvaluationPrincipal: undefined,
    poidsEvaluation: undefined,
    actif: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSelects, setOpenSelects] = useState({
    typeEvaluation: false,
    actif: false,
  });

  const commonInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '2px solid rgba(61,155,255,0.35)',
    color: '#87ceeb',
    height: '56px',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    textAlign: 'left',
    width: '100%',
  };

  useEffect(() => {
    if (module) {
      setFormData({
        nom: module.nom,
        code: module.code,
        descriptionCourte: module.descriptionCourte || '',
        nombreHeuresTotal: module.nombreHeuresTotal,
        coefficient: module.coefficient,
        intervenantPrincipalId: module.intervenantPrincipalId,
        semestre: module.semestre || '',
        typeEvaluationPrincipal: module.typeEvaluationPrincipal,
        poidsEvaluation: module.poidsEvaluation,
        actif: module.actif ?? true,
      });
    }
  }, [module]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.code.trim()) newErrors.code = 'Le code est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <div
      className={cn(styles['base-card'])}
      style={{
        borderTop: '4px solid #3d9bff',
        boxShadow: 'none',
        padding: '2rem',
      }}
    >
      <h3 className={styles['card-title']} style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
        {module ? 'Modifier le module' : 'Nouveau module'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Informations principales */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Informations principales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
            <div>
              <Label htmlFor="nom" className="mb-2 block">
                Nom <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                style={commonInputStyle}
                placeholder="Nom du module"
              />
              {errors.nom && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.nom}</p>}
            </div>
            <div>
              <Label htmlFor="code" className="mb-2 block">
                Code <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                style={commonInputStyle}
                placeholder="Code du module"
              />
              {errors.code && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.code}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="descriptionCourte" className="mb-2 block">Description courte</Label>
              <Input
                id="descriptionCourte"
                value={formData.descriptionCourte || ''}
                onChange={(e) => setFormData({ ...formData, descriptionCourte: e.target.value })}
                style={commonInputStyle}
                placeholder="Description du module"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques du module */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Caractéristiques
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
            <div>
              <Label htmlFor="nombreHeuresTotal" className="mb-2 block">Nombre d'heures total</Label>
              <Input
                id="nombreHeuresTotal"
                type="number"
                min={0}
                value={formData.nombreHeuresTotal || ''}
                onChange={(e) => setFormData({ ...formData, nombreHeuresTotal: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={commonInputStyle}
                placeholder="Heures"
              />
            </div>
            <div>
              <Label htmlFor="coefficient" className="mb-2 block">Coefficient</Label>
              <Input
                id="coefficient"
                type="number"
                min={0}
                step="0.1"
                value={formData.coefficient || ''}
                onChange={(e) => setFormData({ ...formData, coefficient: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={commonInputStyle}
                placeholder="Coefficient"
              />
            </div>
            <div>
              <Label htmlFor="semestre" className="mb-2 block">Semestre</Label>
              <Input
                id="semestre"
                value={formData.semestre || ''}
                onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                style={commonInputStyle}
                placeholder="S1, S2, etc."
              />
            </div>
            <div style={{ marginBottom: openSelects.actif ? 220 : 0 }}>
              <Label htmlFor="actif" className="mb-2 block">Statut</Label>
              <Select
                open={openSelects.actif}
                onOpenChange={(o) => setOpenSelects({ ...openSelects, actif: o })}
                value={formData.actif ? 'true' : 'false'}
                onValueChange={(v) => setFormData({ ...formData, actif: v === 'true' })}
              >
                <SelectTrigger id="actif" style={commonInputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Évaluation */}
        <div className={styles['card-section']}>
          <h4 className={styles['card-title']} style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Évaluation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start">
            <div style={{ marginBottom: openSelects.typeEvaluation ? 220 : 0 }}>
              <Label htmlFor="typeEvaluationPrincipal" className="mb-2 block">Type d'évaluation principal</Label>
              <Select
                open={openSelects.typeEvaluation}
                onOpenChange={(o) => setOpenSelects({ ...openSelects, typeEvaluation: o })}
                value={formData.typeEvaluationPrincipal || 'none'}
                onValueChange={(v) => setFormData({ ...formData, typeEvaluationPrincipal: v === 'none' ? undefined : (v as EvaluationType) })}
              >
                <SelectTrigger id="typeEvaluationPrincipal" style={commonInputStyle}>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non renseigné</SelectItem>
                  <SelectItem value="controle_continu">Contrôle continu</SelectItem>
                  <SelectItem value="examen_final">Examen final</SelectItem>
                  <SelectItem value="projet">Projet</SelectItem>
                  <SelectItem value="participation">Participation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="poidsEvaluation" className="mb-2 block">Poids de l'évaluation (0-1)</Label>
              <Input
                id="poidsEvaluation"
                type="number"
                min={0}
                max={1}
                step="0.1"
                value={formData.poidsEvaluation || ''}
                onChange={(e) => setFormData({ ...formData, poidsEvaluation: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={commonInputStyle}
                placeholder="0.0 - 1.0"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles['card-footer']} style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
          <div>
            {module && onDeleteModule && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
                    onDeleteModule(module._id!);
                  }
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '2px solid #ef4444',
                  color: '#ef4444',
                }}
              >
                Supprimer
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              onClick={onCancel}
              className={styles['card-button-secondary']}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={styles['card-button-primary']}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                module ? 'Enregistrer' : 'Créer'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

