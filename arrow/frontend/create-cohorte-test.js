// create-cohorte-test.js
import axios from 'axios'

const baseURL = process.env.VITE_API_URL || 'http://localhost:4000/api/v1'

async function run() {
  const api = axios.create({ baseURL })

  const payload = {
    nom: 'BTS COM1 2025–2026',
    anneeScolaire: '2025-2026',
    typeFormation: 'BTS',

    // Champs backend existants
    diplome: 'BTS Communication',
    // Valeur d'énum exacte attendue par le backend (avec accents)
    statut: 'En préparation',

    // Dates: ISO (le backend Mongoose cast les strings en Date)
    dateDebut: '2025-09-01T00:00:00.000Z',
    dateFin: '2026-06-30T00:00:00.000Z',

    // Volume horaire
    volumeHoraireTotal: 900,

    // Tags: doivent respecter l'énum backend
    // ['BTS', 'Bachelor', 'Mastère', 'En ligne', 'Présentiel']
    tags: ['BTS'],

    // Requis par le DTO backend (email)
    creePar: 'admin@dev.com',
  }

  try {
    const { data } = await api.post('/cohortes', payload)
    console.log('✅ Cohorte créée:', data)
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


