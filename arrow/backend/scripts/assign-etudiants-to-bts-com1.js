/*
  Assigne tous les étudiants existants à la cohorte "BTS COM1" déjà présente en base.

  Exécution:
    node scripts/assign-etudiants-to-bts-com1.js

  Variables d'environnement:
    MONGODB_URI (ex: mongodb://localhost:27017/arrow)
*/

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI n\'est pas défini. Définissez la variable d\'environnement ou un fichier .env.');
  process.exit(1);
}

const dbNameFromUri = (() => {
  try {
    const u = new URL(MONGODB_URI.replace('mongodb://', 'http://').replace('mongodb+srv://', 'https://'));
    return u.pathname?.replace('/', '') || 'arrow';
  } catch {
    return 'arrow';
  }
})();

async function main() {
  console.log(`🔌 Connexion à MongoDB: ${MONGODB_URI} (db: ${dbNameFromUri})`);
  await mongoose.connect(MONGODB_URI, { dbName: dbNameFromUri });
  console.log('✅ Connecté à MongoDB');

  // Schéma minimal Cohorte aligné sur la collection 'cohortes'
  const CohorteSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true },
      etudiants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apprenants', default: [] }],
    },
    { collection: 'cohortes' }
  );

  // Schéma minimal Etudiant aligné sur la collection 'apprenants'
  const EtudiantSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true },
      prenom: { type: String, required: true },
      cohorteActuelle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohorte' },
      cohortesHistorique: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cohorte' }],
      email: { type: String },
    },
    { collection: 'apprenants' }
  );

  const Cohorte = mongoose.model('Cohorte', CohorteSchema);
  const Etudiant = mongoose.model('Etudiant', EtudiantSchema, 'apprenants');

  // Recherche de la cohorte par nom (argument CLI prioritaire), insensible à la casse
  const cliArg = (process.argv[2] || '').trim();
  const targetName = cliArg.length > 0 ? cliArg : 'bts com1';
  const exactFlexible = new RegExp(`^${targetName.replace(/\s+/g, ' \\s*')}\s*$`, 'i');
  const containsFlexible = new RegExp(targetName.split(/\s+/).join('.*'), 'i');

  let cohorte = await Cohorte.findOne({ nom: { $regex: exactFlexible } });
  if (!cohorte) {
    cohorte = await Cohorte.findOne({ nom: { $regex: containsFlexible } });
  }
  if (!cohorte) {
    console.error(`❌ Cohorte "${targetName}" introuvable. Essayez: node scripts/assign-etudiants-to-bts-com1.js "Nom exact de la cohorte"`);
    const existing = await Cohorte.find({}, { _id: 1, nom: 1 }).limit(50).lean();
    if (existing.length > 0) {
      console.log('\nCohortes existantes (aperçu):');
      existing.forEach((c) => console.log(` - ${c.nom} (${c._id})`));
    } else {
      console.log('Aucune cohorte trouvée dans la collection.');
    }
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`🎯 Cohorte trouvée: ${cohorte.nom} (${cohorte._id})`);

  // Récupérer tous les étudiants existants
  const allStudents = await Etudiant.find({}, { _id: 1, nom: 1, prenom: 1, email: 1, cohortesHistorique: 1 }).lean();
  if (allStudents.length === 0) {
    console.log('ℹ️ Aucun étudiant trouvé dans la collection. Rien à faire.');
    await mongoose.disconnect();
    return;
  }

  // Préparer l'ensemble des ObjectId à ajouter dans la cohorte (sans doublons)
  const existingSet = new Set((cohorte.etudiants || []).map((id) => String(id)));
  const toAddIds = [];

  for (const s of allStudents) {
    const sid = String(s._id);
    if (!existingSet.has(sid)) {
      toAddIds.push(s._id);
    }
  }

  // Mettre à jour la cohorte (ajout des étudiants)
  if (toAddIds.length > 0) {
    await Cohorte.updateOne(
      { _id: cohorte._id },
      { $addToSet: { etudiants: { $each: toAddIds } } }
    );
  }

  // Mettre à jour chaque étudiant: cohorteActuelle et historique
  const bulkOps = allStudents.map((s) => ({
    updateOne: {
      filter: { _id: s._id },
      update: {
        $set: { cohorteActuelle: cohorte._id },
        $addToSet: { cohortesHistorique: cohorte._id },
      },
    },
  }));

  const bulkResult = await Etudiant.bulkWrite(bulkOps, { ordered: false });

  console.log('📈 Résultats mises à jour étudiants:', {
    matched: bulkResult.matchedCount,
    modified: bulkResult.modifiedCount,
    upserts: bulkResult.upsertedCount,
  });

  console.log(`✅ Ajout dans la cohorte: ${toAddIds.length} nouvel(aux) étudiant(s)`);
  console.log(`👥 Total étudiants dans la cohorte après opération (approx.): ${(cohorte.etudiants?.length || 0) + toAddIds.length}`);

  await mongoose.disconnect();
  console.log('🔌 Connexion MongoDB fermée');
}

main().catch(async (err) => {
  console.error('❌ Erreur lors de l\'assignation:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


