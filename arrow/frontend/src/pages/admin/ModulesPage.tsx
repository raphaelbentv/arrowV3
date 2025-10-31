import React, { useEffect, useMemo, useState } from 'react';
import { modulesService } from '../../services/modules';
import { ModuleCours } from '../../types/module';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const emptyForm: Omit<ModuleCours, '_id' | 'createdAt' | 'updatedAt'> = {
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
};

export const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<ModuleCours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ModuleCours | null>(null);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modulesService.getAll();
      setModules(data);
    } catch (e) {
      setError('Erreur lors du chargement des modules');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter(m =>
      m.nom?.toLowerCase().includes(q) || m.code?.toLowerCase().includes(q) || m.descriptionCourte?.toLowerCase().includes(q)
    );
  }, [modules, search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await modulesService.update(editing._id as string, form);
      } else {
        await modulesService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ ...emptyForm });
      await load();
    } catch (err) {
      setError("Erreur lors de l'enregistrement du module");
      console.error(err);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce module ?')) return;
    try {
      await modulesService.delete(id);
      await load();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const startEdit = (m: ModuleCours) => {
    setEditing(m);
    setForm({
      nom: m.nom,
      code: m.code,
      descriptionCourte: m.descriptionCourte,
      nombreHeuresTotal: m.nombreHeuresTotal,
      coefficient: m.coefficient,
      intervenantPrincipalId: m.intervenantPrincipalId,
      semestre: m.semestre,
      typeEvaluationPrincipal: m.typeEvaluationPrincipal,
      poidsEvaluation: m.poidsEvaluation,
      actif: m.actif ?? true,
    });
    setShowForm(true);
  };

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '1400px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black tracking-[0.15em] uppercase" style={{
          background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))'
        }}>Modules</h1>
        <Button size="lg" onClick={startCreate}>Nouveau module</Button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(220, 38, 38, 0.2)', border: '2px solid rgba(220, 38, 38, 0.5)', borderRadius: '12px', color: '#ff6b6b', marginBottom: '1.5rem' }}>{error}</div>
      )}

      <div className="mb-4">
        <Input placeholder="Rechercher par nom, code, description" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && modules.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#87ceeb', letterSpacing: '0.15em', fontWeight: 800 }}>Chargement des modules...</div>
      ) : (
        <div className="overflow-x-auto border border-[rgba(61,155,255,0.25)] rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-[rgba(61,155,255,0.08)] text-[#cbe7ff]">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Heures</th>
                <th className="p-3 text-left">Coef.</th>
                <th className="p-3 text-left">Actif</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[#87ceeb]">Aucun module</td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className="border-t border-[rgba(61,155,255,0.15)]">
                    <td className="p-3">{m.nom}</td>
                    <td className="p-3">{m.code}</td>
                    <td className="p-3">{m.nombreHeuresTotal ?? '-'}</td>
                    <td className="p-3">{m.coefficient ?? '-'}</td>
                    <td className="p-3">{m.actif ? 'Oui' : 'Non'}</td>
                    <td className="p-3 text-right">
                      <Button variant="secondary" onClick={() => startEdit(m)} className="mr-2">Éditer</Button>
                      <Button variant="destructive" onClick={() => onDelete(m._id as string)}>Supprimer</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div style={{ marginTop: '2rem' }}>
          <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)' }}>
            <CardContent>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <label className="block text-sm mb-1">Nom</label>
                  <Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Code</label>
                  <Input value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Description courte</label>
                  <Input value={form.descriptionCourte || ''} onChange={(e) => setForm(f => ({ ...f, descriptionCourte: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nombre d'heures</label>
                  <Input type="number" min={0} value={form.nombreHeuresTotal ?? ''} onChange={(e) => setForm(f => ({ ...f, nombreHeuresTotal: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Coefficient</label>
                  <Input type="number" min={0} value={form.coefficient ?? ''} onChange={(e) => setForm(f => ({ ...f, coefficient: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Semestre</label>
                  <Input value={form.semestre || ''} onChange={(e) => setForm(f => ({ ...f, semestre: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Actif</label>
                  <select className="w-full h-10 bg-transparent border rounded-md" value={form.actif ? 'true' : 'false'} onChange={(e) => setForm(f => ({ ...f, actif: e.target.value === 'true' }))}>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3 justify-end mt-2">
                  <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Annuler</Button>
                  <Button type="submit">{editing ? 'Mettre à jour' : 'Créer'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModulesPage;


