# 📋 SCHÉMA COMPLET DES ROUTES ADMINISTRATEURS

## 🌐 Configuration Backend
- **Base URL**: `http://localhost:4000`
- **Préfixe global**: `/api/v1`
- **Contrôleur**: `AdminController`
- **Authentification**: Désactivée (mode développement)

---

## 🔗 ROUTES DISPONIBLES

### 1. 📝 CRÉATION D'ADMINISTRATEUR
```
POST /api/v1/admin
```
**Description**: Créer un nouvel administrateur
**Body**:
```json
{
  "email": "admin@example.com",
  "nom": "Nom",
  "prenom": "Prénom", 
  "password": "motdepasse123"
}
```
**Réponse**:
```json
{
  "_id": "6900d8809c2f7a05a56c473e",
  "email": "admin@example.com",
  "password": "$2b$10$9FtW3cTXnux92v6QVc1anO73LsbUcM.kvtj2reiKRhpPY4Qo.3WIC",
  "nom": "Nom",
  "prenom": "Prénom",
  "isAdmin": true,
  "permissions": [],
  "createdAt": "2025-10-28T14:51:44.046Z",
  "updatedAt": "2025-10-28T14:51:44.046Z",
  "__v": 0
}
```

### 2. 📋 LISTE DES ADMINISTRATEURS
```
GET /api/v1/admin
```
**Description**: Récupérer tous les administrateurs
**Réponse**:
```json
[
  {
    "_id": "6900d8809c2f7a05a56c473e",
    "email": "admin@example.com",
    "password": "$2b$10$9FtW3cTXnux92v6QVc1anO73LsbUcM.kvtj2reiKRhpPY4Qo.3WIC",
    "nom": "Nom",
    "prenom": "Prénom",
    "isAdmin": true,
    "permissions": [],
    "createdAt": "2025-10-28T14:51:44.046Z",
    "updatedAt": "2025-10-28T14:51:44.046Z",
    "__v": 0
  }
]
```

### 3. 🔍 RÉCUPÉRATION PAR ID
```
GET /api/v1/admin/:id
```
**Description**: Récupérer un administrateur par son ID
**Paramètres**: `id` (ObjectId MongoDB)
**Réponse**: Objet administrateur complet

### 4. ✏️ MISE À JOUR D'ADMINISTRATEUR
```
PUT /api/v1/admin/:id
```
**Description**: Mettre à jour un administrateur existant
**Paramètres**: `id` (ObjectId MongoDB)
**Body**:
```json
{
  "nom": "Nouveau Nom",
  "prenom": "Nouveau Prénom",
  "email": "nouveau@example.com",
  "password": "nouveaumotdepasse123"
}
```
**Réponse**: Objet administrateur mis à jour

### 5. 🗑️ SUPPRESSION D'ADMINISTRATEUR
```
DELETE /api/v1/admin/:id
```
**Description**: Supprimer un administrateur
**Paramètres**: `id` (ObjectId MongoDB)
**Réponse**: Objet administrateur supprimé

### 6. 🚀 CRÉATION INITIALE (PUBLIQUE)
```
POST /api/v1/admin/initial
```
**Description**: Créer le premier administrateur (route publique)
**Body**: Identique à la création normale
**Réponse**: Identique à la création normale

---

## 🎯 UTILISATION FRONTEND

### Service AdministratorsService
```typescript
// Fichier: src/services/administrators.ts
const API_URL = 'http://localhost:4000/api/v1';

// Lister tous les admins
const admins = await administratorsService.getAll();

// Créer un admin
const newAdmin = await administratorsService.create({
  email: 'test@example.com',
  nom: 'Test',
  prenom: 'Admin',
  password: 'password123'
});

// Modifier un admin
const updatedAdmin = await administratorsService.update(adminId, {
  nom: 'Nouveau Nom'
});

// Supprimer un admin
await administratorsService.delete(adminId);
```

---

## 🔧 CONFIGURATION TECHNIQUE

### Backend (NestJS)
- **Contrôleur**: `AdminController`
- **Service**: `AdminService`
- **Schéma**: `Admin` (Mongoose)
- **Base de données**: MongoDB
- **Hachage**: bcrypt (salt rounds: 10)

### Frontend (React)
- **Service**: `AdministratorsService`
- **Pages**: `AdministratorList.tsx`, `AdminPanel.tsx`
- **Interface**: `Administrator`
- **HTTP Client**: Axios

---

## 📊 FLUX DE DONNÉES

```
Frontend (React) 
    ↓ HTTP Requests
Backend (NestJS)
    ↓ Mongoose Queries  
MongoDB Database
    ↓ Responses
Backend (NestJS)
    ↓ HTTP Responses
Frontend (React)
```

---

## 🚨 CODES DE STATUT

- **200**: Succès (GET, PUT, DELETE)
- **201**: Créé avec succès (POST)
- **400**: Données invalides
- **404**: Administrateur non trouvé
- **500**: Erreur serveur

---

## 🔒 SÉCURITÉ

### Mode Développement (Actuel)
- ✅ Aucune authentification requise
- ✅ Toutes les routes sont publiques
- ✅ Pas de validation des permissions

### Mode Production (À implémenter)
- 🔒 Authentification JWT requise
- 🔒 Guards d'autorisation
- 🔒 Validation des permissions
- 🔒 Rate limiting
- 🔒 Validation des données d'entrée

---

## 📝 EXEMPLES D'UTILISATION

### Créer un admin via curl
```bash
curl -X POST http://localhost:4000/api/v1/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "nom": "Test",
    "prenom": "Admin",
    "password": "password123"
  }'
```

### Lister les admins via curl
```bash
curl -X GET http://localhost:4000/api/v1/admin
```

### Modifier un admin via curl
```bash
curl -X PUT http://localhost:4000/api/v1/admin/6900d8809c2f7a05a56c473e \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Nouveau Nom"
  }'
```

### Supprimer un admin via curl
```bash
curl -X DELETE http://localhost:4000/api/v1/admin/6900d8809c2f7a05a56c473e
```

---

## 🎯 ÉTAT ACTUEL

✅ **Fonctionnel**:
- Création d'administrateurs
- Listing des administrateurs  
- Modification d'administrateurs
- Suppression d'administrateurs
- Interface frontend complète
- Persistance en base de données

⚠️ **À améliorer**:
- Authentification et autorisation
- Validation des données
- Gestion d'erreurs avancée
- Tests unitaires et d'intégration
- Documentation API (Swagger)
