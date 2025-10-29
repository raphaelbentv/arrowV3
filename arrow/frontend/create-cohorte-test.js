// create-cohorte-test.js
import axios from 'axios'

const baseURL = process.env.VITE_API_URL || 'http://localhost:4000/api/v1'

async function run() {
  const api = axios.create({ baseURL })

  // Cohorte 1 — BTS Communication (tous les champs du DTO remplis)
  const payload1 = {
    // 🧱 Informations générales
    nom: 'BTS COM1 2025–2026',
    anneeScolaire: '2025-2026',
    typeFormation: 'BTS',
    diplomeVise: 'BTS Communication',
    niveauRNCP: 'Niveau 5',
    etablissement: 'École Supérieure des Médias',
    formationAssociee: 'REF-FORM-BTS-COM-001',

    // 👥 Composition
    nombreEtudiantsPrevu: 28,
    nombreEtudiantsInscrits: 22,
    responsablePedagogique: 'responsable.pedago@ecole.fr',

    // 📅 Organisation et planification
    dateDebut: '2025-09-01T00:00:00.000Z',
    dateFin: '2026-06-30T00:00:00.000Z',
    volumeHoraireTotal: 900,

    // 📂 Structure pédagogique
    matieres: ['Communication', 'Marketing', 'PAO'],
    modules: ['Module COM-1', 'Module COM-2'],
    progressionPedagogique: 'Progression standard BTS COM',

    // 🔍 Suivi administratif et financier
    statut: 'En préparation',
    nombreEtudiantsFinances: 15,
    nombreEtudiantsAutofinances: 7,
    montantTotalFacture: 48000,
    typeFinanceur: 'OPCO',
    nomFinanceur: 'OPCO EP',

    // 🧾 Métadonnées et traçabilité
    creePar: 'admin@dev.com',
    commentairesInternes: 'Groupe motivé, prévoir atelier PAO avancé.',
    tags: ['BTS', 'Présentiel'],

    // Champs legacy pour compatibilité
    description: 'Première année BTS COM — Promo 2025',
    actif: true,
  }

  // Cohorte 2 — MBA Management (tous les champs du DTO remplis)
  const payload2 = {
    // 🧱 Informations générales
    nom: 'MBA Management 2024–2025',
    anneeScolaire: '2024-2025',
    typeFormation: 'Mastère',
    diplomeVise: 'MBA Management',
    niveauRNCP: 'Niveau 7',
    etablissement: 'Institut de Management Avancé',
    formationAssociee: 'REF-FORM-MBA-MGT-2024',

    // 👥 Composition
    nombreEtudiantsPrevu: 35,
    nombreEtudiantsInscrits: 18,
    responsablePedagogique: 'direction.mba@ima.fr',

    // 📅 Organisation et planification
    dateDebut: '2024-10-07T00:00:00.000Z',
    dateFin: '2025-07-11T00:00:00.000Z',
    volumeHoraireTotal: 520,

    // 📂 Structure pédagogique
    matieres: ['Leadership', 'Stratégie', 'Finance d’entreprise'],
    modules: ['Module LEAD-1', 'Module STRAT-1', 'Module FIN-1'],
    progressionPedagogique: 'Tronc commun S1, spécialisation S2',

    // 🔍 Suivi administratif et financier
    statut: 'Active',
    nombreEtudiantsFinances: 10,
    nombreEtudiantsAutofinances: 8,
    montantTotalFacture: 95000,
    typeFinanceur: 'Entreprise',
    nomFinanceur: 'TechCorp Partners',

    // 🧾 Métadonnées et traçabilité
    creePar: 'admin@dev.com',
    commentairesInternes: 'MBA axé leadership; partenariats entreprises en cours.',
    tags: ['Mastère', 'Présentiel'],

    // Champs legacy pour compatibilité
    description: 'Cycle MBA Management 2024',
    actif: true,
  }

  try {
    const { data: c1 } = await api.post('/cohortes', payload1)
    console.log('✅ Cohorte 1 créée:', c1)
    const { data: c2 } = await api.post('/cohortes', payload2)
    console.log('✅ Cohorte 2 créée:', c2)
  } catch (err) {
    if (err.response) {
      console.error('❌ Erreur API:', err.response.status, err.response.data)
    } else {
      console.error('❌ Erreur:', err.message)
    }
    process.exit(1)
  }
}

run()


