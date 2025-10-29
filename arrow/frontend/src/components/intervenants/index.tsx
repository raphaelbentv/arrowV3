import { useEffect, useState } from 'react';
import { Intervenant } from '../../types/intervenant';
import { intervenantsService } from '../../services/intervenants';
import SearchBar from '../common/SearchBar';
import IntervenantCard from '../intervenantCard';
import { Card } from '@/components/ui/card';

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [filteredIntervenants, setFilteredIntervenants] = useState<Intervenant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setLoading(true);
        const data = await intervenantsService.getAll();
        setIntervenants(data);
        setFilteredIntervenants(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des intervenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredIntervenants(intervenants);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtered = intervenants.filter(intervenant =>
      intervenant.nom?.toLowerCase().includes(queryLower) ||
      intervenant.prenom?.toLowerCase().includes(queryLower)
    );
    setFilteredIntervenants(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 mt-4">
        <SearchBar
          data={intervenants}
          onSearch={handleSearch}
          loading={loading}
          placeholder="Rechercher un intervenant..."
        />
      </div>

      <Card className="w-full p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredIntervenants.map((intervenant) => (
            <div key={intervenant._id}>
              <IntervenantCard intervenant={intervenant} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Intervenants;
