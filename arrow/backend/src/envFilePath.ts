import { config } from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '..', '.env');
console.log('Chemin du fichier .env:', envPath);

const result = config({ path: envPath });
console.log('Résultat du chargement .env:', result);

if (result.error) {
  throw new Error(`Erreur lors du chargement du fichier .env: ${result.error.message}`);
}

console.log('MONGO_URI chargée:', process.env.MONGO_URI);