import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, School, BarChart3, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/authContext';
import { intervenantsService } from '../services/intervenants';
import { Intervenant } from '../types/intervenant';
import styles from './AdminDashboard.module.css';

// Types pour la recherche globale
interface SearchResult {
  id: string;
  type: 'intervenant' | 'formation' | 'document' | 'session';
  title: string;
  description: string;
  data?: any;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  useAuth();

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [, setLoading] = useState(false);

  // Données KPI (à connecter avec l'API)
  const kpiData = {
    satisfaction: {
      global: 92,
      evolution: +2.5,
      details: 'Basé sur 150 retours'
    },
    reussite: {
      certification: 88,
      abandon: 5,
      presence: 95
    },
    competences: {
      objectifsAtteints: 85,
      progression: 90,
      validation: 87
    },
    qualiteIntervenants: {
      evaluation: 4.5,
      conformite: 98,
      miseAJour: 95
    }
  };

  // Chargement des intervenants
  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        setLoading(true);
        const data = await intervenantsService.getAll();
        setIntervenants(data);
      } catch (error) {
        console.error('Erreur lors du chargement des intervenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, []);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    const queryLower = query.toLowerCase();
    
    // Recherche dans les intervenants
    const intervenantResults = intervenants
      .filter(intervenant => 
        intervenant.nom?.toLowerCase().includes(queryLower) ||
        intervenant.prenom?.toLowerCase().includes(queryLower) ||
        intervenant.email?.toLowerCase().includes(queryLower) ||
        (intervenant.modulesEnseignes && 
         intervenant.modulesEnseignes.some(module => 
           module.toLowerCase().includes(queryLower)
         )) ||
        (intervenant.domainesExpertise && 
         intervenant.domainesExpertise.some(domaine => 
           domaine.toLowerCase().includes(queryLower)
         ))
      )
      .map(intervenant => ({
        id: intervenant._id,
        type: 'intervenant' as const,
        title: `${intervenant.prenom} ${intervenant.nom}`,
        description: intervenant.poste || 'Intervenant',
        data: intervenant
      }));

    setSearchResults(intervenantResults);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Background Vaporwave */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient sunset */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #0a1a2f 20%, #1a3a5a 40%, rgba(61, 155, 255, 0.3) 80%, rgba(135, 206, 235, 0.3) 100%)'
          }}
        />
        
        {/* Grille rétro */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(61, 155, 255, 0.2) 40px, rgba(61, 155, 255, 0.2) 41px)',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      <div className="content-wrapper max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-bold text-vaporwave text-glow uppercase tracking-wider">
            DASHBOARD ADMIN
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Vue d'ensemble en temps réel
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#87ceeb] opacity-50" />
            <Input
              type="text"
              placeholder="Rechercher un intervenant, une formation, un document..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${styles.searchInput} pl-12 h-14 text-lg`}
            />
          </div>
          {searchResults.length > 0 && (
            <div className={`${styles.searchResults} mt-2 rounded-lg p-2 max-h-60 overflow-y-auto`}>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => {
                    if (result.type === 'intervenant') {
                      navigate(`/intervenants/${result.id}`);
                    }
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className={`${styles.searchResultItem} p-3 rounded cursor-pointer transition-all duration-300`}
                >
                  <div className="font-semibold text-white">{result.title}</div>
                  <div className="text-sm text-gray-400">
                    👤 {result.type === 'intervenant' ? 'Intervenant' : ''} - {result.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className={`${styles.kpiCard} group cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs uppercase tracking-wider text-[#87ceeb] font-bold">
                  Satisfaction
                </h3>
                <div className={`${styles.kpiIconBox} w-[50px] h-[50px] rounded flex items-center justify-center`}>
                  <TrendingUp className="h-8 w-8 text-[#3d9bff]" />
                </div>
              </div>
              <h2 className="text-5xl font-extrabold mb-2 text-vaporwave text-glow">
                {kpiData.satisfaction.global}%
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {kpiData.satisfaction.details}
              </p>
              <Progress value={kpiData.satisfaction.global} className="h-1" />
            </CardContent>
          </Card>

          <Card className={`${styles.kpiCard} group cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs uppercase tracking-wider text-[#87ceeb] font-bold">
                  Taux de Réussite
                </h3>
                <div className={`${styles.kpiIconBox} w-[50px] h-[50px] rounded flex items-center justify-center`}>
                  <School className="h-8 w-8 text-[#3d9bff]" />
                </div>
              </div>
              <h2 className="text-5xl font-extrabold mb-2 text-vaporwave text-glow">
                {kpiData.reussite.certification}%
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {kpiData.reussite.presence}% de présence
              </p>
              <Progress value={kpiData.reussite.certification} className="h-1" />
            </CardContent>
          </Card>

          <Card className={`${styles.kpiCard} group cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs uppercase tracking-wider text-[#87ceeb] font-bold">
                  Compétences
                </h3>
                <div className={`${styles.kpiIconBox} w-[50px] h-[50px] rounded flex items-center justify-center`}>
                  <BarChart3 className="h-8 w-8 text-[#3d9bff]" />
                </div>
              </div>
              <h2 className="text-5xl font-extrabold mb-2 text-vaporwave text-glow">
                {kpiData.competences.objectifsAtteints}%
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {kpiData.competences.progression}% de progression
              </p>
              <Progress value={kpiData.competences.objectifsAtteints} className="h-1" />
            </CardContent>
          </Card>

          <Card className={`${styles.kpiCard} group cursor-pointer`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs uppercase tracking-wider text-[#87ceeb] font-bold">
                  Qualité Intervenants
                </h3>
                <div className={`${styles.kpiIconBox} w-[50px] h-[50px] rounded flex items-center justify-center`}>
                  <Users className="h-8 w-8 text-[#3d9bff]" />
                </div>
              </div>
              <h2 className="text-5xl font-extrabold mb-2 text-vaporwave text-glow">
                {kpiData.qualiteIntervenants.conformite}%
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {kpiData.qualiteIntervenants.miseAJour}% à jour
              </p>
              <Progress value={kpiData.qualiteIntervenants.conformite} className="h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="border-t border-[rgba(61,155,255,0.2)] my-8 pt-8">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide text-[#87ceeb]">
            Actions rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cohorte Card */}
            <Card 
              className={`${styles.actionCard} h-full cursor-pointer group`}
              onClick={() => navigate('/admin/cohortes')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${styles.kpiIconBox} w-16 h-16 rounded-lg flex items-center justify-center`}>
                    <GraduationCap className="h-8 w-8 text-[#3d9bff]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#87ceeb] uppercase">Cohortes</h3>
                    <p className="text-sm text-gray-400">Gérer les groupes</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-[#87ceeb] transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>

            {/* Users Card */}
            <Card 
              className={`${styles.actionCard} h-full cursor-pointer group`}
              onClick={() => navigate('/admin/users')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${styles.kpiIconBox} w-16 h-16 rounded-lg flex items-center justify-center`}>
                    <Users className="h-8 w-8 text-[#3d9bff]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#87ceeb] uppercase">Utilisateurs</h3>
                    <p className="text-sm text-gray-400">Administrer les comptes</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-[#87ceeb] transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>

            {/* Intervenants Card */}
            <Card 
              className={`${styles.actionCard} h-full cursor-pointer group`}
              onClick={() => navigate('/admin/intervenant-list')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${styles.kpiIconBox} w-16 h-16 rounded-lg flex items-center justify-center`}>
                    <Users className="h-8 w-8 text-[#3d9bff]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#87ceeb] uppercase">Intervenants</h3>
                    <p className="text-sm text-gray-400">Gérer les profs</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-[#87ceeb] transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
