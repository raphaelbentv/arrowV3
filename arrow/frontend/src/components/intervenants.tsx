/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Intervenant } from "../types/intervenant";
import { intervenantsService } from "../services/intervenants";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import IntervenantCard from './intervenantCard';

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await intervenantsService.getAll();
        setIntervenants(data);
      } catch (err) {
        setError("Erreur lors du chargement des intervenants");
      }
    };
    fetchData();
  }, []);

  const filteredIntervenants = intervenants.filter(intervenant => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      intervenant.nom?.toLowerCase().includes(searchLower) ||
      intervenant.prenom?.toLowerCase().includes(searchLower) ||
      (intervenant.domainesExpertise || []).some(domaine => 
        domaine.toLowerCase().includes(searchLower)
      )
    );
  });

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Liste des Intervenants
      </Typography>
      <Input
        placeholder="Rechercher un intervenant"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredIntervenants.map((intervenant) => (
            <IntervenantCard
              key={intervenant._id}
              intervenant={intervenant}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Intervenants;