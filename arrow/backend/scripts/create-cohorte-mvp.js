/*
  Crée une cohorte conforme au schéma MVP et renseigne tous les champs pertinents.

  - Utilise des étudiants déjà existants (collection 'apprenants') pour la composition
  - Tente d'utiliser un intervenant existant comme responsable pédagogique
  - Renseigne les statistiques dérivées de la composition
  - Renseigne createdBy/updatedBy si des users existent

  Exécution:
    MONGODB_URI="mongodb://localhost:27017/arrow" node scripts/create-cohorte-mvp.js "BTS Commerce 2024" "BTS-COM-24"

  Arguments:
    [0] nom (par défaut: "BTS Commerce 2024")
    [1] code unique (par défaut: "BTS-COM-24")
*/

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI est requis. Exemple: MONGODB_URI="mongodb+srv://user:pass@cluster/dbname"');
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
  console.log('🔌 Connexion MongoDB (db détectée):', dbNameFromUri);
  await mongoose.connect(MONGODB_URI, { dbName: dbNameFromUri });
  console.log('✅ Connecté à MongoDB');

  // Schemas minimalistes alignés avec collections existantes
  const CohorteSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true },
      code: { type: String, required: true, unique: true },
      dateDebut: { type: Date, required: true },
      dateFinPrevue: { type: Date, required: true },
      statut: { type: String, enum: ['Active', 'Terminée'], default: 'Active', required: true },
      responsablePedagogiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervenants' },
      composition: [
        {
          etudiantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Apprenants', required: true },
          dateInscription: { type: Date, required: true },
          statut: { type: String, enum: ['Actif', 'Abandon'], default: 'Actif' },
        },
      ],
      modulesCohorte: [
        {
          moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Modules', required: true },
          intervenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intervenants', required: true },
          planning: {
            jourSemaine: { type: String, required: true },
            heureDebut: { type: String, required: true },
            heureFin: { type: String, required: true },
            salle: { type: String, required: true },
          },
        },
      ],
      nombreTotalEtudiants: { type: Number, default: 0 },
      nombreEtudiantsActifs: { type: Number, default: 0 },
      tauxPresenceGlobal: { type: Number, default: 0 },
      moyenneGenerale: { type: Number, default: 0 },
      tauxAbandon: { type: Number, default: 0 },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    },
    { collection: 'cohortes', timestamps: true }
  );

  const Cohorte = mongoose.model('Cohorte', CohorteSchema);
  const Etudiant = mongoose.model(
    'Etudiant',
    new mongoose.Schema({}, { strict: false }),
    'apprenants'
  );
  const Intervenant = mongoose.model(
    'Intervenant',
    new mongoose.Schema({}, { strict: false }),
    'intervenants'
  );
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
  const Module = mongoose.model('Module', new mongoose.Schema({}, { strict: false }), 'modules');

  // Paramètres d'entrée
  const now = new Date();
  const y = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ts = `${y}${mm}${dd}${hh}${min}`;

  const inputNom = (process.argv[2] && process.argv[2].trim()) || `BTS Commerce ${y}`;
  const inputCode = (process.argv[3] && process.argv[3].trim()) || `BTS-COM-${String(y).slice(-2)}`;

  // Génération d'un code unique si collision
  async function generateUniqueCode(base) {
    let candidate = `${base}-${ts}`; // suffixe timestamp pour garantir l'unicité
    const exists = await Cohorte.findOne({ code: candidate }).lean();
    if (!exists) return candidate;
    // fallback incrémental si extraordinaire collision
    let i = 1;
    while (await Cohorte.findOne({ code: `${candidate}-${i}` }).lean()) {
      i += 1;
    }
    return `${candidate}-${i}`;
  }

  // Génération d'un nom unique si collision
  async function generateUniqueName(base) {
    let candidate = `${base} (${ts})`;
    const exists = await Cohorte.findOne({ nom: candidate }).lean();
    if (!exists) return candidate;
    let i = 1;
    while (await Cohorte.findOne({ nom: `${candidate} #${i}` }).lean()) {
      i += 1;
    }
    return `${candidate} #${i}`;
  }

  // Prépare les références
  const [someStudents, someIntervenant, someUser, someModule] = await Promise.all([
    Etudiant.find({}, { _id: 1 }).limit(20).lean(),
    Intervenant.findOne({}, { _id: 1 }).lean(),
    User.findOne({}, { _id: 1 }).lean(),
    Module.findOne({}, { _id: 1 }).lean(),
  ]);

  if (!someStudents || someStudents.length === 0) {
    console.error('❌ Aucun étudiant trouvé dans la collection "apprenants". Veuillez d\'abord en créer.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const composition = someStudents.map((s) => ({
    etudiantId: s._id,
    dateInscription: now,
    statut: 'Actif',
  }));

  // Si un module et un intervenant existent, créer un exemple de module planifié
  const modulesCohorte = [];
  if (someModule && someIntervenant) {
    modulesCohorte.push({
      moduleId: someModule._id,
      intervenantId: someIntervenant._id,
      planning: { jourSemaine: 'Lundi', heureDebut: '09:00', heureFin: '12:00', salle: 'A101' },
    });
  }

  const nombreTotalEtudiants = composition.length;
  const nombreEtudiantsActifs = composition.filter((c) => c.statut === 'Actif').length;
  const tauxAbandon = nombreTotalEtudiants === 0 ? 0 : Math.round(((nombreTotalEtudiants - nombreEtudiantsActifs) / nombreTotalEtudiants) * 100);

  // Calcule des dates (défaut: rentrée 1er sept cette année, fin 30 juin prochaine)
  const defaultDateDebut = new Date(`${y}-09-01T08:00:00.000Z`);
  const defaultDateFin = new Date(`${y + 1}-06-30T16:00:00.000Z`);

  // Assure un nom/code uniques
  const nom = await generateUniqueName(inputNom);
  const code = await generateUniqueCode(inputCode);

  const doc = {
    nom,
    code,
    dateDebut: defaultDateDebut,
    dateFinPrevue: defaultDateFin,
    statut: 'Active',
    responsablePedagogiqueId: someIntervenant ? someIntervenant._id : undefined,
    composition,
    modulesCohorte,
    nombreTotalEtudiants,
    nombreEtudiantsActifs,
    tauxPresenceGlobal: 0,
    moyenneGenerale: 0,
    tauxAbandon,
    createdBy: someUser ? someUser._id : undefined,
    updatedBy: someUser ? someUser._id : undefined,
  };

  const created = await Cohorte.create(doc);
  console.log('✅ Cohorte créée:', {
    _id: created._id,
    nom: created.nom,
    code: created.code,
    etudiants: created.composition?.length || 0,
    responsablePedagogiqueId: created.responsablePedagogiqueId || null,
  });

  await mongoose.disconnect();
  console.log('🔌 Connexion MongoDB fermée');
}

main().catch(async (err) => {
  console.error('❌ Erreur lors de la création de la cohorte:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


