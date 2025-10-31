/*
  Seed des modules dans la base MongoDB, collection `modules`.
  Exécution locale:
    node scripts/seed-modules.js
  Production (vraie BDD):
    MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority" node scripts/seed-modules.js

  Options:
    --reset  Supprime les modules existants avant insertion (ATTENTION en production)

  Variables d'environnement:
    MONGODB_URI       Chaîne de connexion complète (recommandé en prod)
    MONGODB_DBNAME    (optionnel) Nom de base si non présent dans l'URI
*/

const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arrow';
  const explicitDbName = process.env.MONGODB_DBNAME;
  const args = process.argv.slice(2);
  const doReset = args.includes('--reset') || process.env.RESET === '1';

  // Déterminer le dbName si fourni séparément, sinon tenter d'extraire du chemin
  // Par défaut, cibler la base "arrow" (dossier principal), sauf override explicite
  let dbNameOption = { dbName: 'arrow' };
  if (explicitDbName) {
    dbNameOption = { dbName: explicitDbName };
  } else {
    try {
      const normalized = uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://');
      const u = new URL(normalized);
      const dbFromPath = u.pathname?.replace('/', '');
      if (dbFromPath) {
        dbNameOption = { dbName: dbFromPath };
      }
      // Si aucun nom dans l'URI, on reste sur "arrow"
    } catch {
      // Pas bloquant: on utilise "arrow" par défaut
      dbNameOption = { dbName: 'arrow' };
    }
  }

  console.log(`Connecting to MongoDB: ${uri} ${dbNameOption.dbName ? `(db: ${dbNameOption.dbName})` : ''}`);
  await mongoose.connect(uri, dbNameOption);

  const ModuleSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true },
      code: { type: String, required: true, unique: true },
      descriptionCourte: { type: String },
      nombreHeuresTotal: { type: Number, min: 0 },
      coefficient: { type: Number, min: 0 },
      intervenantPrincipalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervenant' },
      semestre: { type: String },
      typeEvaluationPrincipal: {
        type: String,
        enum: ['controle_continu', 'examen_final', 'projet', 'participation'],
      },
      poidsEvaluation: { type: Number, min: 0, max: 1 },
      actif: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
    { collection: 'modules', timestamps: true }
  );

  const Module = mongoose.model('ModuleCours', ModuleSchema);

  const docs = [
    {
      nom: 'Marketing Digital',
      code: 'MKT-301',
      descriptionCourte: 'Fondamentaux du marketing digital et stratégies de communication en ligne',
      nombreHeuresTotal: 30,
      coefficient: 2,
      semestre: 'S3',
      typeEvaluationPrincipal: 'controle_continu',
      poidsEvaluation: 0.6,
      actif: true,
    },
    {
      nom: 'Développement Front-end',
      code: 'DEV-401',
      descriptionCourte: 'React, TypeScript et bonnes pratiques de développement web',
      nombreHeuresTotal: 60,
      coefficient: 3,
      semestre: 'S4',
      typeEvaluationPrincipal: 'projet',
      poidsEvaluation: 0.7,
      actif: true,
    },
    {
      nom: 'Base de données',
      code: 'DB-302',
      descriptionCourte: 'Conception et gestion de bases de données relationnelles et NoSQL',
      nombreHeuresTotal: 40,
      coefficient: 2.5,
      semestre: 'S3',
      typeEvaluationPrincipal: 'examen_final',
      poidsEvaluation: 0.5,
      actif: true,
    },
    {
      nom: 'Communication Professionnelle',
      code: 'COM-201',
      descriptionCourte: 'Techniques de communication écrite et orale en milieu professionnel',
      nombreHeuresTotal: 25,
      coefficient: 1.5,
      semestre: 'S2',
      typeEvaluationPrincipal: 'participation',
      poidsEvaluation: 0.4,
      actif: true,
    },
    {
      nom: 'Gestion de Projet',
      code: 'GP-501',
      descriptionCourte: 'Méthodologies Agile, Scrum et gestion de projet IT',
      nombreHeuresTotal: 35,
      coefficient: 2,
      semestre: 'S5',
      typeEvaluationPrincipal: 'projet',
      poidsEvaluation: 0.8,
      actif: true,
    },
  ];

  try {
    const existingCount = await Module.countDocuments();
    if (existingCount > 0) {
      if (doReset) {
        console.log(`⚠️  ${existingCount} module(s) existant(s). --reset activé: suppression...`);
        await Module.deleteMany({});
        console.log('✅ Anciens modules supprimés.');
      } else {
        console.log(`ℹ️  ${existingCount} module(s) déjà présent(s). Insertion en mode ajout sans suppression.`);
      }
    }

    // Insertion en évitant les doublons par code
    const ops = [];
    for (const m of docs) {
      ops.push(
        Module.updateOne(
          { code: m.code },
          { $setOnInsert: m },
          { upsert: true }
        )
      );
    }
    const bulk = await Promise.all(ops);
    const upserts = bulk.filter((r) => r.upsertedId || r.upsertedCount > 0).length;
    console.log(`✅ Upsert terminé. Nouveaux modules insérés: ${upserts}.`);

    const result = await Module.find({ code: { $in: docs.map(d => d.code) } }).lean();
    console.log(`✅ Inserted ${result.length} modules:`);
    result.forEach((d) => console.log(`   - ${d.nom} (${d.code}) [${d._id}]`));
  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Erreur: Un module avec ce code existe déjà.');
      console.error('   Détails:', error.keyValue);
    } else {
      console.error('❌ Erreur lors de l\'insertion:', error.message);
    }
    throw error;
  }

  await mongoose.disconnect();
  console.log('✅ Done.');
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});

