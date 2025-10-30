/*
  Seed deux cohortes dans la base MongoDB `arrow`, collection `cohortes`.
  Exécution:
    node scripts/seed-cohortes.js
  Optionnel: définir MONGODB_URI, sinon défaut mongodb://localhost/arrow
*/

const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost/arrow';
  const dbNameFromUri = (() => {
    try {
      const u = new URL(uri.replace('mongodb://', 'http://'));
      return u.pathname?.replace('/', '') || 'arrow';
    } catch {
      return 'arrow';
    }
  })();

  console.log(`Connecting to MongoDB: ${uri} (db: ${dbNameFromUri})`);
  await mongoose.connect(uri, { dbName: dbNameFromUri });

  const CohorteSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true },
      anneeScolaire: { type: String, enum: ['2023-2024', '2024-2025', '2025-2026'], required: true },
      typeFormation: { type: String, enum: ['BTS', 'Bachelor', 'Mastère', 'Autre'], required: true },
      diplome: { type: String },
      statut: { type: String, enum: ['En préparation', 'Active', 'Clôturée'], default: 'En préparation', required: true },

      dateDebut: { type: Date },
      dateFin: { type: Date },
      volumeHoraireTotal: { type: Number, default: 0 },

      etudiants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apprenants', default: [] }],
      intervenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intervenants', default: [] }],

      modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Modules', default: [] }],
      cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours', default: [] }],
      dossiersCours: [{ type: String, default: [] }],

      tauxPresenceMoyen: { type: Number, default: 0 },
      tauxProgression: { type: Number, default: 0 },
      dernierAppel: { type: Date },
      nbSessionsPrevues: { type: Number, default: 0 },
      nbSessionsEffectuees: { type: Number, default: 0 },

      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
      notesInternes: { type: String },
      tags: [{ type: String, enum: ['BTS', 'Bachelor', 'Mastère', 'En ligne', 'Présentiel'], default: [] }],
    },
    { collection: 'cohortes' }
  );

  const Cohorte = mongoose.model('Cohorte', CohorteSchema);

  const now = new Date();

  const docs = [
    {
      nom: 'Bachelor Design UI 2024',
      anneeScolaire: '2024-2025',
      typeFormation: 'Bachelor',
      diplome: 'Bachelor Design UI',
      statut: 'Active',
      dateDebut: new Date('2024-09-16'),
      dateFin: new Date('2025-06-20'),
      volumeHoraireTotal: 420,
      etudiants: [],
      intervenants: [],
      modules: [],
      cours: [],
      dossiersCours: ['https://cdn.arrow/assets/design-ui/s1', 'drive://cohortes/design-ui-2024'],
      tauxPresenceMoyen: 92,
      tauxProgression: 48,
      dernierAppel: now,
      nbSessionsPrevues: 80,
      nbSessionsEffectuees: 38,
      createdBy: undefined,
      notesInternes: 'Groupe motivé, progression conforme. Prévoir atelier Figma avancé.',
      tags: ['Bachelor', 'Présentiel'],
    },
    {
      nom: 'BTS Développement Web 2024',
      anneeScolaire: '2024-2025',
      typeFormation: 'BTS',
      diplome: 'BTS SIO Option SLAM',
      statut: 'En préparation',
      dateDebut: new Date('2024-10-01'),
      dateFin: new Date('2025-07-04'),
      volumeHoraireTotal: 600,
      etudiants: [],
      intervenants: [],
      modules: [],
      cours: [],
      dossiersCours: ['https://cdn.arrow/assets/bts-dev/s1'],
      tauxPresenceMoyen: 0,
      tauxProgression: 0,
      dernierAppel: null,
      nbSessionsPrevues: 120,
      nbSessionsEffectuees: 0,
      createdBy: undefined,
      notesInternes: 'En phase de constitution. Recrutements intervenants back-end à finaliser.',
      tags: ['BTS', 'En ligne'],
    },
  ];

  const result = await Cohorte.insertMany(docs);
  console.log(`Inserted ${result.length} cohortes:`);
  result.forEach((d) => console.log(` - ${d.nom} (${d._id})`));

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});







