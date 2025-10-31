import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/authContext';
import { administratorsService } from '@/services/administrators';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setPrenom(user.firstName || '');
      setNom(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!user?.id) return;
    try {
      setSaving(true);
      if (user.id === 'dev-admin-id') {
        // Mode dev: pas de persistance backend disponible
        setMessage('Profil mis à jour (simulation dev)');
      } else {
        await administratorsService.update(user.id, { prenom, nom, email });
        setMessage('Profil mis à jour');
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto px-4 md:px-8" style={{ maxWidth: '900px', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 className="text-3xl font-black tracking-[0.15em] uppercase mb-6" style={{
        background: 'linear-gradient(180deg, #3d9bff, #87ceeb, #5dbaff)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        filter: 'drop-shadow(0 0 25px rgba(61, 155, 255, 0.45))'
      }}>Mon profil</h1>
      {message && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(61,155,255,0.35)', color: '#cfeaff', background: 'rgba(61,155,255,0.08)', marginBottom: 16 }}>{message}</div>
      )}
      <Card style={{ background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(61, 155, 255, 0.25)' }}>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;


