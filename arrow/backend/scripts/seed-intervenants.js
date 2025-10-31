const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';

// 4 intervenants fictifs, enrichis avec un maximum de champs du schéma
const intervenants = [
  {
    // Informations générales
    nom: 'Giraud',
    prenom: 'Élise',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elise',
    email: 'elise.giraud@example.com',
    telephone: '0612457890',
    adresse: '14 Rue de Bretagne, 75003 Paris',
    dateNaissance: new Date('1989-04-22'),

    // Informations professionnelles
    poste: 'Formatrice Frontend & Qualité',
    statut: 'Indépendant',
    experience: '9 ans – Agences & écoles supérieures',
    domainesExpertise: ['React', 'TypeScript', 'Testing', 'Accessibilité', 'Performance Web'],
    diplomes: 'Master MIAGE – Université Paris-Dauphine',
    cv: 'https://example.com/cv/giraud-elise.pdf',

    // Données contractuelles
    typeContrat: 'Prestation',
    dateDebutMission: new Date('2025-09-02'),
    dateFinMission: new Date('2026-06-30'),
    tarification: '650€/jour (forfait ateliers possible)',
    heuresPrevues: 180,
    rib: 'FR7610096000301234567890456',
    clauses: 'NDA, propriété intellectuelle, non-sollicitation',

    // Informations pédagogiques
    modulesEnseignes: ['React avancé', 'Qualité & Tests E2E', 'Accessibilité RGAA'],
    heuresParModule: 22,
    niveauEtudiants: 'Bac+3 à Bac+5',
    supportsPedagogiques: 'https://example.com/supports/react-quality-a11y.zip',
    methodesPedagogiques: 'Ateliers pair-programming, TDD, audits Lighthouse',

    // Documents administratifs
    pieceIdentite: 'https://example.com/docs/giraud-elise-id.pdf',
    numeroSiret: '84256190300027',
    assuranceRC: 'https://example.com/docs/giraud-elise-rc.pdf',
    extraitKbis: 'https://example.com/docs/giraud-elise-kbis.pdf',
    justificatifsDiplomes: 'https://example.com/docs/giraud-elise-diplomes.pdf',
    conventionContrat: 'https://example.com/docs/giraud-elise-contrat.pdf',
    attestationURSSAF: 'https://example.com/docs/giraud-elise-urssaf.pdf',

    // Suivi et Évaluation
    appreciationsEtudiants: [
      'Très claire et structurée',
      'Excellents ateliers pratiques',
      'Feedbacks pertinents sur les PR'
    ],
    feedbackResponsables: [
      'Respect des délais et du scope',
      'Très bonne coordination avec l\'équipe pédagogique'
    ],
    pointsAmelioration: 'Prévoir plus d\'exemples sur Jest + React Testing Library',
    disponibilites: 'Lundi-Mardi-Jeudi',
    engagement: 'Disponible année scolaire complète',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nom: 'Moreira',
    prenom: 'Rui',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rui',
    email: 'rui.moreira@example.com',
    telephone: '0678901234',
    adresse: '27 Boulevard des Belges, 69006 Lyon',
    dateNaissance: new Date('1986-09-11'),

    poste: 'Formateur Data Engineering',
    statut: 'Salarié',
    experience: '11 ans – Big Data & Pipelines temps réel',
    domainesExpertise: ['Python', 'Pandas', 'Spark', 'Airflow', 'MLflow'],
    diplomes: 'Ingénieur Télécom – IST Lisbonne',
    cv: 'https://example.com/cv/moreira-rui.pdf',

    typeContrat: 'CDI',
    dateDebutMission: new Date('2025-09-01'),
    dateFinMission: null,
    tarification: 'Interne – forfait horaire',
    heuresPrevues: 240,
    rib: 'FR7630004000039876543210123',
    clauses: 'Politique sécurité interne, confidentialité',

    modulesEnseignes: ['Python avancé', 'Pipelines de données', 'Orchestration Airflow'],
    heuresParModule: 28,
    niveauEtudiants: 'Bac+5',
    supportsPedagogiques: 'https://example.com/supports/python-airflow-mlflow.zip',
    methodesPedagogiques: 'Cours + TP encadrés + mini-projets',

    pieceIdentite: 'https://example.com/docs/moreira-rui-id.pdf',
    numeroSiret: '',
    assuranceRC: '',
    extraitKbis: '',
    justificatifsDiplomes: 'https://example.com/docs/moreira-rui-diplomes.pdf',
    conventionContrat: 'https://example.com/docs/moreira-rui-contrat.pdf',
    attestationURSSAF: '',

    appreciationsEtudiants: [
      'Exemples concrets d\'entreprise',
      'Disponible pour aider en dehors des heures'
    ],
    feedbackResponsables: [
      'Très bon cadrage des livrables',
      'Propositions d\'évolution du programme pertinentes'
    ],
    pointsAmelioration: 'Alléger la partie Spark Streaming pour les non-initiés',
    disponibilites: 'Mardi-Jeudi-Vendredi',
    engagement: 'Interne – référent Data',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nom: 'Kouamé',
    prenom: 'Aïcha',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aicha',
    email: 'aicha.kouame@example.com',
    telephone: '0655012200',
    adresse: '3 Cours Victor Hugo, 33000 Bordeaux',
    dateNaissance: new Date('1991-01-17'),

    poste: 'Intervenante UX/UI & Design System',
    statut: 'Auto-entrepreneur',
    experience: '8 ans – UX Research & Design Ops',
    domainesExpertise: ['UX Research', 'Design System', 'Prototypage Figma', 'Accessibilité'],
    diplomes: 'Master Design Interactif – Paris 8',
    cv: 'https://example.com/cv/kouame-aicha.pdf',

    typeContrat: 'Freelance',
    dateDebutMission: new Date('2025-10-10'),
    dateFinMission: new Date('2026-03-31'),
    tarification: '600€/jour',
    heuresPrevues: 140,
    rib: 'FR7610096000302223334445556',
    clauses: 'Cession de droits sur les supports produits',

    modulesEnseignes: ['UX Research', 'Design System à l\'échelle', 'Accessibilité Web'],
    heuresParModule: 20,
    niveauEtudiants: 'Bac+3',
    supportsPedagogiques: 'https://example.com/supports/ux-ds-access.zip',
    methodesPedagogiques: 'Projets tutorés, revues de livrables, design critique',

    pieceIdentite: 'https://example.com/docs/kouame-aicha-id.pdf',
    numeroSiret: '90234156700038',
    assuranceRC: 'https://example.com/docs/kouame-aicha-rc.pdf',
    extraitKbis: '',
    justificatifsDiplomes: 'https://example.com/docs/kouame-aicha-diplomes.pdf',
    conventionContrat: 'https://example.com/docs/kouame-aicha-prestation.pdf',
    attestationURSSAF: 'https://example.com/docs/kouame-aicha-urssaf.pdf',

    appreciationsEtudiants: [
      'Cas réels inspirants',
      'Très impliquée et bienveillante'
    ],
    feedbackResponsables: [
      'Livrables très qualitatifs',
      'Très bonne pédagogie'
    ],
    pointsAmelioration: 'Mieux calibrer l\'équilibre entre théorie et ateliers',
    disponibilites: 'Lundi-Mercredi-Jeudi',
    engagement: 'Partielle – 6 mois',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nom: 'Benali',
    prenom: 'Yacine',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yacine',
    email: 'yacine.benali@example.com',
    telephone: '0644778899',
    adresse: '19 Rue Nationale, 59000 Lille',
    dateNaissance: new Date('1985-12-08'),

    poste: 'Intervenant Cloud & DevOps',
    statut: 'Indépendant',
    experience: '13 ans – Cloud AWS/GCP, Sécurité, CI/CD',
    domainesExpertise: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    diplomes: 'MSc Réseaux & Systèmes – INSA Lyon',
    cv: 'https://example.com/cv/benali-yacine.pdf',

    typeContrat: 'Prestation',
    dateDebutMission: new Date('2025-11-20'),
    dateFinMission: new Date('2026-07-20'),
    tarification: '780€/jour',
    heuresPrevues: 200,
    rib: 'FR7630006000011234567890199',
    clauses: 'Clauses sécurité & conformité RGPD, PRA',

    modulesEnseignes: ['AWS fondamentaux', 'Kubernetes pour les devs', 'CI/CD GitHub Actions'],
    heuresParModule: 26,
    niveauEtudiants: 'Bac+4',
    supportsPedagogiques: 'https://example.com/supports/aws-k8s-cicd.zip',
    methodesPedagogiques: 'Démos live, labs guidés, challenges notés',

    pieceIdentite: 'https://example.com/docs/benali-yacine-id.pdf',
    numeroSiret: '75234123900012',
    assuranceRC: 'https://example.com/docs/benali-yacine-rc.pdf',
    extraitKbis: 'https://example.com/docs/benali-yacine-kbis.pdf',
    justificatifsDiplomes: 'https://example.com/docs/benali-yacine-diplomes.pdf',
    conventionContrat: 'https://example.com/docs/benali-yacine-contrat.pdf',
    attestationURSSAF: 'https://example.com/docs/benali-yacine-urssaf.pdf',

    appreciationsEtudiants: [
      'Très concret et orienté prod',
      'Exemples DevOps pertinents et utiles'
    ],
    feedbackResponsables: [
      'Modules très appréciés',
      'Excellente préparation des labs et supports'
    ],
    pointsAmelioration: 'Réduire la densité des sessions CI/CD – proposer des pauses',
    disponibilites: 'Jeudi-Vendredi',
    engagement: 'Mission longue – 8 mois',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const { connection } = mongoose;

const parseDbNameFromUri = () => {
  try {
    const u = new URL(MONGODB_URI.replace('mongodb://', 'http://').replace('mongodb+srv://', 'https://'));
    const path = (u.pathname || '').replace('/', '');
    return path || '';
  } catch {
    return '';
  }
};

async function seedIntervenants() {
  try {
    const dbNameInUri = parseDbNameFromUri();
    const connectOptions = dbNameInUri ? {} : { dbName: 'arrow' };
    console.log(`🔌 Connexion à MongoDB via URI: ${MONGODB_URI}${dbNameInUri ? '' : ' (db par défaut: arrow)'}`);
    await mongoose.connect(MONGODB_URI, connectOptions);
    console.log('✅ Connecté à MongoDB');
    console.log(`📦 Base active: ${connection.name}`);

    // Définir le schéma Intervenant, aligné avec backend/src/intervenants/intervenants.schema.ts
    const IntervenantSchema = new mongoose.Schema(
      {
        // Informations générales
        nom: { type: String, required: true },
        prenom: { type: String, required: true },
        photo: String,
        email: { type: String, required: true, unique: true },
        telephone: { type: String, required: true },
        adresse: String,
        dateNaissance: Date,

        // Informations professionnelles
        poste: { type: String, required: true },
        statut: { type: String, required: true },
        experience: String,
        domainesExpertise: [String],
        diplomes: String,
        cv: String,

        // Données contractuelles
        typeContrat: { type: String, required: true },
        dateDebutMission: Date,
        dateFinMission: Date,
        tarification: String,
        heuresPrevues: Number,
        rib: String,
        clauses: String,

        // Informations pédagogiques
        modulesEnseignes: [String],
        heuresParModule: Number,
        niveauEtudiants: String,
        supportsPedagogiques: String,
        methodesPedagogiques: String,

        // Documents administratifs
        pieceIdentite: String,
        numeroSiret: String,
        assuranceRC: String,
        extraitKbis: String,
        justificatifsDiplomes: String,
        conventionContrat: String,
        attestationURSSAF: String,

        // Suivi et Évaluation
        appreciationsEtudiants: [String],
        feedbackResponsables: [String],
        pointsAmelioration: String,
        disponibilites: String,
        engagement: String,

        createdAt: { type: Date, default: Date.now },
        updatedAt: Date,
      },
      { collection: 'intervenants' }
    );

    const Intervenant = mongoose.model('Intervenant', IntervenantSchema, 'intervenants');

    // Vérifier s'il y a déjà des intervenants
    const existingCount = await Intervenant.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} intervenant(s) existent déjà dans la collection.`);
      const existingEmails = await Intervenant.find({
        email: { $in: intervenants.map(i => i.email) }
      }).select('email').lean();
      if (existingEmails.length > 0) {
        console.log('⚠️  Certains intervenants existent déjà (emails):', existingEmails.map(e => e.email).join(', '));
      }
    }

    // Insérer les intervenants
    const result = await Intervenant.insertMany(intervenants, { ordered: false });
    console.log(`✅ ${result.length} intervenant(s) créé(s) avec succès`);

    // Afficher un récap
    console.log('\n📋 Intervenants créés:');
    result.forEach((intervenant) => {
      console.log(`   ${intervenant.prenom} ${intervenant.nom} (${intervenant.email}) - ID: ${intervenant._id}`);
      console.log(`      Poste: ${intervenant.poste} | Statut: ${intervenant.statut}`);
      console.log(`      Contrat: ${intervenant.typeContrat} | Tarification: ${intervenant.tarification || 'N/A'}`);
      if (Array.isArray(intervenant.domainesExpertise) && intervenant.domainesExpertise.length) {
        console.log(`      Expertise: ${intervenant.domainesExpertise.join(', ')}`);
      }
    });

    console.log('\n🎉 Seed intervenants terminé avec succès!');

  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Erreur: Des intervenants avec ces emails existent déjà');
      console.error('Détails:', error.message);
    } else {
      console.error('❌ Erreur lors du seed intervenants:', error);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
seedIntervenants().catch(console.error);


