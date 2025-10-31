const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';

const etudiants = [
  {
    nom: 'Lefebvre',
    prenom: 'Alexandre',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre',
    email: 'alexandre.lefebvre@example.com',
    telephone: '0611121314',
    adresse: '27 Rue de la Paix, 69001 Lyon',
    dateNaissance: new Date('2002-05-18'),
    lieuNaissance: 'Lyon',
    nationalite: 'Française',
    genre: 'M',
    numeroEtudiant: 'ETU2025001',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'BTS Systèmes Numériques',
    niveau: 'Bac+2',
    typeFinancement: 'Apprentissage',
    montantFinancement: 850,
    organismeFinanceur: 'TechCorp Solutions',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2027-06-30'),
    moyenneGenerale: 16.2,
    tauxPresence: 94,
    tauxProgression: 82,
    notes: [
      {
        module: 'Informatique industrielle',
        note: 17,
        date: new Date('2025-11-10'),
        commentaire: 'Excellente maîtrise des systèmes embarqués'
      },
      {
        module: 'Réseaux et télécommunications',
        note: 15.5,
        date: new Date('2025-11-25'),
        commentaire: 'Bonne compréhension des protocoles réseau'
      },
      {
        module: 'Électronique numérique',
        note: 16,
        date: new Date('2025-12-05'),
        commentaire: 'Solide base technique'
      },
      {
        module: 'Projet professionnel',
        note: 16.5,
        date: new Date('2025-12-15'),
        commentaire: 'Projet bien structuré et innovant'
      }
    ],
    absences: ['2025-10-08'],
    retards: ['2025-09-18', '2025-11-12'],
    situationActuelle: 'Étudiant en apprentissage, travaille 3 semaines par mois en entreprise. Souhaite poursuivre en Licence Professionnelle Réseaux et Télécommunications.',
    objectifs: 'Obtenir le BTS avec mention très bien, perfectionner ses compétences en cybersécurité, puis intégrer une grande entreprise tech en CDI.',
    difficultesRencontrees: 'Équilibre entre entreprise et études exigeant mais géré avec sérieux. Quelques difficultés en mathématiques appliquées, amélioration notoire grâce au tutorat.',
    commentaires: 'Étudiant très professionnel, maturité technique remarquable. Excellent en entreprise, autonome et force de proposition. Potentiel évident pour des postes techniques spécialisés.',
    tags: ['BTS', 'Apprentissage', 'Technique', 'Cybersécurité', 'Motivé'],
    cv: 'https://example.com/cv/lefebvre-alexandre.pdf',
    lettreMotivation: 'https://example.com/documents/lefebvre-lm.pdf',
    diplomes: 'Baccalauréat STI2D mention bien, Certificat Cisco CCNA en cours',
    piecesIdentite: 'https://example.com/documents/lefebvre-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/lefebvre-financement.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Moreau',
    prenom: 'Camille',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camille',
    email: 'camille.moreau@example.com',
    telephone: '0622232425',
    adresse: '89 Boulevard Haussmann, 75008 Paris',
    dateNaissance: new Date('2001-08-30'),
    lieuNaissance: 'Paris',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025002',
    statutInscription: 'Admis',
    dateInscription: new Date('2025-09-15'),
    formationSuivie: 'Master 2 Gestion des Ressources Humaines',
    niveau: 'Bac+5',
    typeFinancement: 'CPF',
    montantFinancement: 6200,
    organismeFinanceur: 'Compte Personnel de Formation',
    dateDebutFinancement: new Date('2025-09-15'),
    dateFinFinancement: new Date('2026-06-30'),
    moyenneGenerale: 15.8,
    tauxPresence: 91,
    tauxProgression: 75,
    notes: [
      {
        module: 'Droit du travail',
        note: 16,
        date: new Date('2025-11-12'),
        commentaire: 'Excellente connaissance juridique, très bons cas pratiques'
      },
      {
        module: 'Gestion de la paie',
        note: 15,
        date: new Date('2025-11-28'),
        commentaire: 'Maîtrise des outils de paie, analyse approfondie'
      },
      {
        module: 'Recrutement et sélection',
        note: 17.5,
        date: new Date('2025-12-08'),
        commentaire: 'Excellent sens relationnel, méthodologie de recrutement solide'
      },
      {
        module: 'Gestion des talents',
        note: 14.5,
        date: new Date('2025-12-18'),
        commentaire: 'Bonne compréhension des enjeux RH modernes'
      },
      {
        module: 'Mémoire professionnel',
        note: 16,
        date: new Date('2026-01-15'),
        commentaire: 'Mémoire de qualité sur la transformation digitale RH'
      }
    ],
    absences: ['2025-10-15', '2025-11-22'],
    retards: ['2025-09-25'],
    situationActuelle: 'Étudiante en Master 2 RH après 2 ans d\'expérience en tant qu\'assistante RH. Recherche active d\'un poste de Responsable RH Junior.',
    objectifs: 'Obtenir le Master avec mention bien, développer une expertise en recrutement digital, intégrer une startup tech ou un grand groupe dans les 3 mois après obtention du diplôme.',
    difficultesRencontrees: 'Conciliation emploi/études prenante mais très motivante. Quelques difficultés initiales en statistiques appliquées, cours de renforcement suivis avec succès.',
    commentaires: 'Profil très prometteur. Expérience terrain appréciable, excellent niveau académique, excellente capacité d\'analyse et de synthèse. Très bon potentiel managérial. Candidate idéale pour des postes RH stratégiques.',
    tags: ['Master', 'RH', 'CPF', 'Expérience', 'Manager'],
    cv: 'https://example.com/cv/moreau-camille.pdf',
    lettreMotivation: 'https://example.com/documents/moreau-lm.pdf',
    diplomes: 'Licence Sciences de l\'Éducation mention bien, Master 1 RH mention assez bien',
    piecesIdentite: 'https://example.com/documents/moreau-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/moreau-cpf.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Petit',
    prenom: 'Mehdi',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi',
    email: 'mehdi.petit@example.com',
    telephone: '0633343536',
    adresse: '143 Avenue Jean Jaurès, 69007 Lyon',
    dateNaissance: new Date('2003-02-14'),
    lieuNaissance: 'Grenoble',
    nationalite: 'Marocaine',
    genre: 'M',
    numeroEtudiant: 'ETU2025003',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'Bachelor Commerce International',
    niveau: 'Bac+3',
    typeFinancement: 'Bourse',
    montantFinancement: 4200,
    organismeFinanceur: 'CROUS',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2026-06-30'),
    moyenneGenerale: 14.5,
    tauxPresence: 87,
    tauxProgression: 68,
    notes: [
      {
        module: 'Commerce international',
        note: 15,
        date: new Date('2025-11-05'),
        commentaire: 'Bonnes bases théoriques, excellente connaissance des incoterms'
      },
      {
        module: 'Marketing export',
        note: 14,
        date: new Date('2025-11-20'),
        commentaire: 'Analyse pertinente des marchés internationaux'
      },
      {
        module: 'Logistique internationale',
        note: 13.5,
        date: new Date('2025-12-03'),
        commentaire: 'Compréhension globale, à approfondir les aspects douaniers'
      },
      {
        module: 'Langues étrangères (Anglais)',
        note: 16,
        date: new Date('2025-12-12'),
        commentaire: 'Niveau B2 confirmé, très bonne expression écrite'
      },
      {
        module: 'Langues étrangères (Espagnol)',
        note: 15.5,
        date: new Date('2025-12-12'),
        commentaire: 'Bon niveau B1, progression notable'
      }
    ],
    absences: ['2025-10-12', '2025-11-05', '2025-11-19'],
    retards: ['2025-09-22', '2025-10-08', '2025-11-26', '2025-12-10'],
    situationActuelle: 'Étudiant boursier, très motivé. Travaille à temps partiel en restauration pour compléter la bourse. Projet d\'échange ERASMUS en Espagne au semestre 2.',
    objectifs: 'Obtenir le Bachelor avec mention, effectuer un semestre ERASMUS en Espagne, perfectionner l\'espagnol, puis intégrer un Master Commerce International ou trouver un poste en import-export.',
    difficultesRencontrees: 'Rythme de travail soutenu (études + emploi) mais bonne organisation. Difficultés ponctuelles en logistique mais cours de soutien suivis. Motivation sans faille.',
    commentaires: 'Étudiant travailleur et déterminé. Bon niveau académique malgré les contraintes financières. Excellente capacité d\'adaptation. Projet d\'études à l\'étranger très positif. Potentiel pour des carrières à l\'international.',
    tags: ['Bachelor', 'Commerce International', 'Boursier', 'International', 'ERASMUS'],
    cv: 'https://example.com/cv/petit-mehdi.pdf',
    lettreMotivation: 'https://example.com/documents/petit-lm.pdf',
    diplomes: 'Baccalauréat ES mention bien',
    piecesIdentite: 'https://example.com/documents/petit-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/petit-bourse.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Rousseau',
    prenom: 'Léa',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lea',
    email: 'lea.rousseau@example.com',
    telephone: '0644454647',
    adresse: '56 Rue de Rivoli, 75004 Paris',
    dateNaissance: new Date('2000-12-05'),
    lieuNaissance: 'Toulouse',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025004',
    statutInscription: 'Diplômé',
    dateInscription: new Date('2024-09-01'),
    formationSuivie: 'Mastère Spécialisé Data Science et Intelligence Artificielle',
    niveau: 'Bac+6',
    typeFinancement: 'Autofinancé',
    montantFinancement: 0,
    organismeFinanceur: '',
    dateDebutFinancement: null,
    dateFinFinancement: null,
    moyenneGenerale: 17.2,
    tauxPresence: 98,
    tauxProgression: 95,
    notes: [
      {
        module: 'Machine Learning',
        note: 18,
        date: new Date('2024-11-15'),
        commentaire: 'Excellente maîtrise des algorithmes, projet d\'envergure remarquable'
      },
      {
        module: 'Deep Learning',
        note: 17.5,
        date: new Date('2024-11-30'),
        commentaire: 'Très bonne compréhension des réseaux de neurones, code Python exemplaire'
      },
      {
        module: 'Big Data et traitement distribué',
        note: 17,
        date: new Date('2024-12-10'),
        commentaire: 'Maîtrise de Spark et Hadoop, architecture solide'
      },
      {
        module: 'Visualisation de données',
        note: 16.5,
        date: new Date('2024-12-20'),
        commentaire: 'Dashboards très professionnels, sens de la dataviz'
      },
      {
        module: 'Projet de fin d\'études',
        note: 18.5,
        date: new Date('2025-01-20'),
        commentaire: 'Projet exceptionnel sur la prédiction de demande énergétique, publication en cours'
      }
    ],
    absences: [],
    retards: [],
    situationActuelle: 'Diplômée depuis juin 2025. Actuellement Data Scientist Senior chez TechData Analytics. Continue à suivre l\'actualité de l\'école et participe à des événements alumni.',
    objectifs: 'Développer une expertise reconnue en IA générative, participer à des conférences en tant que speaker, éventuellement créer sa propre startup dans le domaine de l\'IA appliquée à la santé.',
    difficultesRencontrees: 'Aucune difficulté majeure, excellente académique. Parfois trop perfectionniste mais cela est devenu une force.',
    commentaires: 'Profil d\'exception. Excellente étudiante, brillante techniquement et académiquement. Projet de fin d\'études remarquable avec potentiel de publication. Carrière très prometteuse. Très bon relationnel et capacité de leadership.',
    tags: ['Mastère', 'Data Science', 'IA', 'Diplômée', 'Excellente', 'Alumni'],
    cv: 'https://example.com/cv/rousseau-lea.pdf',
    lettreMotivation: 'https://example.com/documents/rousseau-lm.pdf',
    diplomes: 'Master Informatique mention très bien, Certifications AWS et Google Cloud Platform',
    piecesIdentite: 'https://example.com/documents/rousseau-identite.pdf',
    justificatifsFinancement: '',
    documents: [],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-06-30')
  },
  {
    nom: 'Garcia',
    prenom: 'Thomas',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    email: 'thomas.garcia@example.com',
    telephone: '0655565758',
    adresse: '12 Place Bellecour, 69002 Lyon',
    dateNaissance: new Date('2002-09-21'),
    lieuNaissance: 'Bordeaux',
    nationalite: 'Française',
    genre: 'M',
    numeroEtudiant: 'ETU2025005',
    statutInscription: 'En attente',
    dateInscription: new Date('2025-08-15'),
    formationSuivie: 'BTS Commerce International',
    niveau: 'Bac+2',
    typeFinancement: 'Alternance',
    montantFinancement: 1100,
    organismeFinanceur: 'ImportExport International SA',
    dateDebutFinancement: new Date('2025-09-15'),
    dateFinFinancement: new Date('2027-06-30'),
    moyenneGenerale: 0,
    tauxPresence: 0,
    tauxProgression: 0,
    notes: [],
    absences: [],
    retards: [],
    situationActuelle: 'Nouvellement inscrit, dossier en cours de validation. Démarrera sa formation en septembre 2025. Alternance prévue en import-export.',
    objectifs: 'Valider son inscription, obtenir le BTS Commerce International, développer une expertise en commerce avec l\'Asie, puis poursuivre en Bachelor Commerce International ou directement en poste.',
    difficultesRencontrees: 'Dossier d\'inscription en cours de finalisation, quelques documents à compléter pour le financement alternance.',
    commentaires: 'Jeune candidat motivé avec un intérêt réel pour le commerce international. Bon profil pour l\'alternance. Dossier en cours d\'examen, validation prévue sous peu.',
    tags: ['BTS', 'Commerce International', 'Alternance', 'Nouveau', 'En attente'],
    cv: 'https://example.com/cv/garcia-thomas.pdf',
    lettreMotivation: 'https://example.com/documents/garcia-lm.pdf',
    diplomes: 'Baccalauréat STMG mention assez bien',
    piecesIdentite: 'https://example.com/documents/garcia-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/garcia-alternance.pdf',
    documents: [],
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date()
  },
  {
    nom: 'Dufour',
    prenom: 'Amélie',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelie',
    email: 'amelie.dufour@example.com',
    telephone: '0666676869',
    adresse: '78 Rue du Faubourg Saint-Antoine, 75011 Paris',
    dateNaissance: new Date('2001-04-17'),
    lieuNaissance: 'Nantes',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025006',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'Licence Pro Web Design et Communication Digitale',
    niveau: 'Bac+3',
    typeFinancement: 'Entreprise',
    montantFinancement: 5500,
    organismeFinanceur: 'DesignStudio Pro',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2026-08-31'),
    moyenneGenerale: 15.3,
    tauxPresence: 89,
    tauxProgression: 71,
    notes: [
      {
        module: 'Design graphique',
        note: 16,
        date: new Date('2025-11-08'),
        commentaire: 'Créativité remarquable, excellente maîtrise d\'Adobe Creative Suite'
      },
      {
        module: 'UI/UX Design',
        note: 15.5,
        date: new Date('2025-11-22'),
        commentaire: 'Bonne compréhension des enjeux utilisateurs, prototypes très aboutis'
      },
      {
        module: 'Développement front-end',
        note: 14,
        date: new Date('2025-12-06'),
        commentaire: 'Code propre, bonnes pratiques respectées'
      },
      {
        module: 'Marketing digital',
        note: 15,
        date: new Date('2025-12-18'),
        commentaire: 'Analyse pertinente des campagnes digitales'
      }
    ],
    absences: ['2025-10-20', '2025-11-15'],
    retards: ['2025-09-28', '2025-12-08'],
    situationActuelle: 'Étudiante en alternance, travaille 2 jours par semaine en agence de design. Réalise des projets concrets pour des clients réels, très enrichissant professionnellement.',
    objectifs: 'Obtenir la Licence Pro avec mention, développer une expertise en design de marque, créer son portfolio professionnel, puis intégrer une agence créative ou devenir freelance.',
    difficultesRencontrees: 'Équilibre entre créativité et contraintes techniques parfois difficile mais très formateur. Perfectionnisme qui ralentit parfois les livraisons, appris à mieux gérer le temps.',
    commentaires: 'Étudiante créative et talentueuse. Excellent sens esthétique, projets très professionnels. Maturité dans le travail en agence. Potentiel évident pour une carrière dans le design créatif. Profil très recherché.',
    tags: ['Licence Pro', 'Web Design', 'Financement entreprise', 'Créative', 'UI/UX'],
    cv: 'https://example.com/cv/dufour-amelie.pdf',
    lettreMotivation: 'https://example.com/documents/dufour-lm.pdf',
    diplomes: 'BTS Design Graphique mention bien, Certificats Adobe Photoshop, Illustrator, XD',
    piecesIdentite: 'https://example.com/documents/dufour-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/dufour-financement.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ,
  {
    nom: 'Marchand',
    prenom: 'Clara',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara',
    email: 'clara.marchand@example.com',
    telephone: '0690010203',
    adresse: '18 Rue de Metz, 31000 Toulouse',
    dateNaissance: new Date('2003-07-09'),
    lieuNaissance: 'Toulouse',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025010',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'Licence Informatique',
    niveau: 'Bac+3',
    typeFinancement: 'Bourse',
    montantFinancement: 3200,
    organismeFinanceur: 'CROUS',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2026-06-30'),
    moyenneGenerale: 15.4,
    tauxPresence: 92,
    tauxProgression: 78,
    notes: [
      { module: 'Structures de données', note: 16, date: new Date('2025-11-14'), commentaire: 'Très bonnes bases algorithmiques' },
      { module: 'Systèmes', note: 14.5, date: new Date('2025-11-30'), commentaire: 'Bonnes notions d’OS' }
    ],
    absences: ['2025-10-12'],
    retards: ['2025-11-07'],
    situationActuelle: 'Étudiante boursière, active au club IA.',
    objectifs: 'Poursuivre en Master IA',
    difficultesRencontrees: 'Prise de parole en public',
    commentaires: 'Profil sérieux et régulier.',
    tags: ['IA', 'Algo', 'Motivée'],
    cv: 'https://example.com/cv/marchand-clara.pdf',
    lettreMotivation: 'https://example.com/documents/marchand-lm.pdf',
    diplomes: 'Baccalauréat Général (spé Maths/NSI)',
    piecesIdentite: 'https://example.com/documents/marchand-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/marchand-bourse.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Gonzalez',
    prenom: 'Enzo',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enzo',
    email: 'enzo.gonzalez@example.com',
    telephone: '0688899977',
    adresse: '4 Place des Terreaux, 69001 Lyon',
    dateNaissance: new Date('2004-02-21'),
    lieuNaissance: 'Lyon',
    nationalite: 'Franco-espagnole',
    genre: 'M',
    numeroEtudiant: 'ETU2025011',
    statutInscription: 'En attente',
    dateInscription: new Date('2025-09-15'),
    formationSuivie: 'Bachelor Marketing Digital',
    niveau: 'Bac+3',
    typeFinancement: 'Alternance',
    montantFinancement: 900,
    organismeFinanceur: 'MarketCorp SAS',
    dateDebutFinancement: new Date('2025-10-01'),
    dateFinFinancement: new Date('2026-09-30'),
    moyenneGenerale: 13.2,
    tauxPresence: 88,
    tauxProgression: 65,
    notes: [
      { module: 'SEO/SEA', note: 14, date: new Date('2025-11-10'), commentaire: 'Bon sens analytique' },
      { module: 'Content Strategy', note: 13, date: new Date('2025-12-01'), commentaire: 'Créatif' }
    ],
    absences: [],
    retards: ['2025-11-03'],
    situationActuelle: 'Alternant en agence digitale',
    objectifs: 'Devenir traffic manager',
    difficultesRencontrees: 'Gestion du temps',
    commentaires: 'Proactif, bons retours des tuteurs.',
    tags: ['SEO', 'Alternance'],
    cv: 'https://example.com/cv/gonzalez-enzo.pdf',
    lettreMotivation: 'https://example.com/documents/gonzalez-lm.pdf',
    diplomes: 'Bac STMG mention bien',
    piecesIdentite: 'https://example.com/documents/gonzalez-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/gonzalez-alternance.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Diallo',
    prenom: 'Aminata',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata',
    email: 'aminata.diallo@example.com',
    telephone: '0677001122',
    adresse: '22 Rue Nationale, 59000 Lille',
    dateNaissance: new Date('2002-11-05'),
    lieuNaissance: 'Lille',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025012',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'M1 Gestion de Projet',
    niveau: 'Bac+4',
    typeFinancement: 'Entreprise',
    montantFinancement: 5200,
    organismeFinanceur: 'InnovPME',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2026-08-31'),
    moyenneGenerale: 14.8,
    tauxPresence: 95,
    tauxProgression: 80,
    notes: [
      { module: 'Méthodes agiles', note: 16, date: new Date('2025-11-06'), commentaire: 'Très bonne maîtrise Scrum' },
      { module: 'Pilotage projet', note: 15, date: new Date('2025-12-02'), commentaire: 'Bon leadership' }
    ],
    absences: [],
    retards: [],
    situationActuelle: 'Chef de projet junior en alternance',
    objectifs: 'Certif PMP',
    difficultesRencontrees: 'Néant',
    commentaires: 'Très bon potentiel managérial',
    tags: ['Agile', 'PMO', 'PMP'],
    cv: 'https://example.com/cv/diallo-aminata.pdf',
    lettreMotivation: 'https://example.com/documents/diallo-lm.pdf',
    diplomes: 'Licence Management',
    piecesIdentite: 'https://example.com/documents/diallo-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/diallo-entreprise.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Nguyen',
    prenom: 'Minh',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    email: 'minh.nguyen@example.com',
    telephone: '0655123344',
    adresse: '5 Rue Sainte-Catherine, 33000 Bordeaux',
    dateNaissance: new Date('2001-03-19'),
    lieuNaissance: 'Bordeaux',
    nationalite: 'Française',
    genre: 'M',
    numeroEtudiant: 'ETU2025013',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'BTS SIO',
    niveau: 'Bac+2',
    typeFinancement: 'CPF',
    montantFinancement: 2500,
    organismeFinanceur: 'Compte Personnel Formation',
    dateDebutFinancement: new Date('2025-09-01'),
    dateFinFinancement: new Date('2026-06-30'),
    moyenneGenerale: 13.9,
    tauxPresence: 89,
    tauxProgression: 74,
    notes: [
      { module: 'Réseaux', note: 14, date: new Date('2025-11-21'), commentaire: 'Bases solides' },
      { module: 'Dev Web', note: 13.5, date: new Date('2025-12-12'), commentaire: 'Bon niveau JavaScript' }
    ],
    absences: ['2025-10-03'],
    retards: ['2025-10-17'],
    situationActuelle: 'Projet de stage en cours',
    objectifs: 'Monter en DevOps',
    difficultesRencontrees: 'Docker/K8s à approfondir',
    commentaires: 'Curieux et appliqué',
    tags: ['Réseaux', 'DevWeb', 'CPF'],
    cv: 'https://example.com/cv/nguyen-minh.pdf',
    lettreMotivation: 'https://example.com/documents/nguyen-lm.pdf',
    diplomes: 'Bac S',
    piecesIdentite: 'https://example.com/documents/nguyen-identite.pdf',
    justificatifsFinancement: 'https://example.com/documents/nguyen-cpf.pdf',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Ben Ahmed',
    prenom: 'Yasmine',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmine',
    email: 'yasmine.benahmed@example.com',
    telephone: '0644332211',
    adresse: '11 Rue Paradis, 13001 Marseille',
    dateNaissance: new Date('2000-09-28'),
    lieuNaissance: 'Marseille',
    nationalite: 'Française',
    genre: 'F',
    numeroEtudiant: 'ETU2025014',
    statutInscription: 'Inscrit',
    dateInscription: new Date('2025-09-01'),
    formationSuivie: 'MBA Management',
    niveau: 'Bac+5',
    typeFinancement: 'Autofinancé',
    montantFinancement: 0,
    organismeFinanceur: '',
    dateDebutFinancement: null,
    dateFinFinancement: null,
    moyenneGenerale: 16.1,
    tauxPresence: 96,
    tauxProgression: 85,
    notes: [
      { module: 'Stratégie', note: 16.5, date: new Date('2025-12-01'), commentaire: 'Vision globale' },
      { module: 'Finance', note: 15.8, date: new Date('2025-12-15'), commentaire: 'Très bonne analyse' }
    ],
    absences: [],
    retards: [],
    situationActuelle: 'Stage fin d’études recherché',
    objectifs: 'Consulting stratégique',
    difficultesRencontrees: 'R.A.S',
    commentaires: 'Excellent profil',
    tags: ['MBA', 'Stratégie', 'Management'],
    cv: 'https://example.com/cv/benahmed-yasmine.pdf',
    lettreMotivation: 'https://example.com/documents/benahmed-lm.pdf',
    diplomes: 'Master Management',
    piecesIdentite: 'https://example.com/documents/benahmed-identite.pdf',
    justificatifsFinancement: '',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const dbNameFromUri = (() => {
  try {
    const u = new URL(MONGODB_URI.replace('mongodb://', 'http://').replace('mongodb+srv://', 'https://'));
    return u.pathname?.replace('/', '') || 'arrow';
  } catch {
    return 'arrow';
  }
})();

async function seedEtudiants() {
  try {
    console.log(`🔌 Connexion à MongoDB: ${MONGODB_URI} (db: ${dbNameFromUri})`);
    await mongoose.connect(MONGODB_URI, { dbName: dbNameFromUri });
    console.log('✅ Connecté à MongoDB');

    // Définir le schéma
    const EtudiantSchema = new mongoose.Schema(
      {
        nom: { type: String, required: true },
        prenom: { type: String, required: true },
        photo: String,
        email: { type: String, required: true, unique: true },
        telephone: { type: String, required: true },
        adresse: String,
        dateNaissance: Date,
        lieuNaissance: String,
        nationalite: String,
        genre: { type: String, enum: ['M', 'F', 'Autre'] },
        numeroEtudiant: String,
        statutInscription: { type: String, required: true, default: 'En attente' },
        dateInscription: Date,
        cohorteActuelle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohorte' },
        cohortesHistorique: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cohorte' }],
        formationSuivie: String,
        niveau: String,
        documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
        cv: String,
        lettreMotivation: String,
        diplomes: String,
        piecesIdentite: String,
        justificatifsFinancement: String,
        typeFinancement: String,
        montantFinancement: Number,
        organismeFinanceur: String,
        dateDebutFinancement: Date,
        dateFinFinancement: Date,
        moyenneGenerale: { type: Number, min: 0, max: 20 },
        tauxPresence: { type: Number, min: 0, max: 100 },
        tauxProgression: { type: Number, min: 0, max: 100 },
        notes: [{
          module: String,
          note: Number,
          date: Date,
          commentaire: String
        }],
        absences: [String],
        retards: [String],
        situationActuelle: String,
        objectifs: String,
        difficultesRencontrees: String,
        commentaires: String,
        tags: [String],
        compteUtilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: Date
      },
      { collection: 'apprenants' }
    );

    const Etudiant = mongoose.model('Etudiant', EtudiantSchema, 'apprenants');
    const Cohorte = mongoose.models.Cohorte || mongoose.model('Cohorte', new mongoose.Schema({ nom: String }, { collection: 'cohortes' }), 'cohortes');

    // Vérifier si des étudiants existent déjà
    const existingCount = await Etudiant.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} étudiant(s) existent déjà dans la collection.`);
      console.log('Pour réinitialiser, videz d\'abord la collection avec: db.apprenants.deleteMany({})');
      
      // Vérifier si ces étudiants spécifiques existent déjà
      const existingEmails = await Etudiant.find({
        email: { $in: etudiants.map(e => e.email) }
      }).select('email').lean();
      
      if (existingEmails.length > 0) {
        console.log('⚠️  Certains étudiants existent déjà (emails):', existingEmails.map(e => e.email).join(', '));
      }
    }

    // Lier les 5 derniers étudiants à une cohorte existante si trouvée
    try {
      const cohorte = await Cohorte.findOne().select('_id nom').lean();
      if (cohorte) {
        console.log(`🔗 Liaison des 5 nouveaux étudiants à la cohorte: ${cohorte.nom} (${cohorte._id})`);
        const start = Math.max(etudiants.length - 5, 0);
        for (let i = start; i < etudiants.length; i++) {
          etudiants[i].cohorteActuelle = cohorte._id;
          etudiants[i].cohortesHistorique = [cohorte._id];
        }
      } else {
        console.log('⚠️  Aucune cohorte trouvée, insertion sans liaison.');
      }
    } catch (e) {
      console.log('⚠️  Erreur lors de la récupération d\'une cohorte existante:', e?.message || e);
    }

    // Filtrer les étudiants déjà existants par email pour éviter les doublons
    const existingByEmail = await Etudiant.find({
      email: { $in: etudiants.map(e => e.email) }
    }).select('email').lean();
    const existingSet = new Set(existingByEmail.map(e => e.email));
    let toInsert = etudiants.filter(e => !existingSet.has(e.email));

    if (toInsert.length === 0) {
      console.log('ℹ️  Aucun nouvel étudiant à insérer (tous les emails existent déjà).');
      console.log('\n🎉 Seed terminé (aucune insertion nécessaire).');
      return;
    }

    // Lier tous les nouveaux étudiants à une cohorte existante si disponible
    try {
      const cohorte = await Cohorte.findOne().select('_id nom').lean();
      if (cohorte) {
        console.log(`🔗 Liaison des nouveaux étudiants à la cohorte: ${cohorte.nom} (${cohorte._id})`);
        toInsert = toInsert.map(e => ({
          ...e,
          cohorteActuelle: cohorte._id,
          cohortesHistorique: [cohorte._id],
        }));
      } else {
        console.log('⚠️  Aucune cohorte trouvée, insertion sans liaison.');
      }
    } catch (e) {
      console.log('⚠️  Erreur lors de la récupération d\'une cohorte existante:', e?.message || e);
    }

    // Insérer uniquement les nouveaux étudiants
    const result = await Etudiant.insertMany(toInsert, { ordered: false });
    console.log(`✅ ${result.length} étudiant(s) créé(s) avec succès`);

    // Afficher les IDs créés
    console.log('\n📋 Étudiants créés:');
    result.forEach((etudiant) => {
      console.log(`   ${etudiant.prenom} ${etudiant.nom} (${etudiant.email}) - ID: ${etudiant._id}`);
      console.log(`      Formation: ${etudiant.formationSuivie || 'N/A'}`);
      console.log(`      Statut: ${etudiant.statutInscription}`);
      console.log(`      Financement: ${etudiant.typeFinancement || 'N/A'} - ${etudiant.montantFinancement || 0}€`);
      if (etudiant.moyenneGenerale > 0) {
        console.log(`      Moyenne: ${etudiant.moyenneGenerale}/20 | Présence: ${etudiant.tauxPresence}%`);
      }
    });

    console.log('\n🎉 Seed terminé avec succès!');

  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Erreur: Des étudiants avec ces emails existent déjà');
      console.error('Détails:', error.message);
    } else {
      console.error('❌ Erreur lors du seed:', error);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
seedEtudiants().catch(console.error);
