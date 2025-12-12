# MIA - Messaging and Interaction Application

Application de messagerie instantanée avec gestion de contacts et partage sur les réseaux sociaux.

## 🌟 Fonctionnalités

### 📱 Gestion des Utilisateurs
- Inscription et connexion avec JWT
- Gestion des profils utilisateurs
- Système de rôles et permissions
- Authentification sécurisée avec bcrypt

### 📇 Gestion des Contacts
- CRUD complet pour les contacts
- Catégorisation des contacts
- Recherche avancée de contacts
- Import/Export de contacts

### 💬 Chat en Temps Réel
- Messagerie instantanée avec Socket.IO
- Notifications en temps réel
- Indicateur "en train d'écrire"
- Historique des conversations
- Statut de lecture des messages

### 🔗 Partage de Contacts
- Partage de contacts entre utilisateurs via le chat
- Génération de liens de partage pour:
  - WhatsApp
  - Telegram
  - Facebook
  - LinkedIn
  - Instagram (copie de texte)
- Import de contacts partagés

### 🔔 Notifications
- Notifications en temps réel
- Compteur de notifications non lues
- Notifications pour nouveaux messages
- Notifications pour contacts partagés

### 🔐 Sécurité
- Authentification JWT
- Permissions basées sur les rôles
- Hashage des mots de passe
- Protection CORS

## 🛠️ Technologies

- **Backend**: Node.js, Express.js, TypeScript
- **Base de données**: PostgreSQL avec Prisma ORM
- **Temps réel**: Socket.IO
- **Authentification**: JWT, bcrypt
- **Validation**: Express validators

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- PostgreSQL
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
cd /home/sankara-sarata/Documents/MIA
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mia_db"
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Créer la base de données**
```bash
# Créer la base de données PostgreSQL
createdb mia_db

# Ou via psql
psql -U postgres
CREATE DATABASE mia_db;
\q
```

5. **Générer le client Prisma et exécuter les migrations**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. **Seeder la base de données**
```bash
npm run seed
```

7. **Démarrer le serveur**
```bash
# Mode développement avec hot-reload
npm run dev

# Mode production
npm run build
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📚 Documentation API

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "telephone": "+22890123456",
  "motDePasse": "password123",
  "adresse": "123 rue de Paris",
  "sexe": "M"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "motDePasse": "password123"
}
```

### Utilisateurs

```http
GET /api/users/profile
Authorization: Bearer {token}

GET /api/users
Authorization: Bearer {token}

GET /api/users/:id
Authorization: Bearer {token}

PUT /api/users/:id
Authorization: Bearer {token}

DELETE /api/users/:id
Authorization: Bearer {token}
```

### Contacts

```http
GET /api/contacts
Authorization: Bearer {token}

GET /api/contacts/:id
Authorization: Bearer {token}

GET /api/contacts/search?query=nom
Authorization: Bearer {token}

POST /api/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "nom": "Kouassi",
  "prenom": "Kofi",
  "telephone": "+22890444444",
  "email": "kofi@example.com",
  "adresse": "15 rue du Commerce",
  "fonction": "Directeur",
  "organisation": "Entreprise ABC",
  "notes": "Contact important",
  "categorieId": 1
}

PUT /api/contacts/:id
Authorization: Bearer {token}

DELETE /api/contacts/:id
Authorization: Bearer {token}
```

### Messages

```http
GET /api/messages
Authorization: Bearer {token}

GET /api/messages/conversations
Authorization: Bearer {token}

GET /api/messages/conversation/:userId
Authorization: Bearer {token}

POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "receiverId": 2,
  "contenu": "Bonjour!",
  "typeMessage": "text"
}

PUT /api/messages/:id/read
Authorization: Bearer {token}
```

### Partage de Contacts

```http
POST /api/share/contact
Authorization: Bearer {token}
Content-Type: application/json

{
  "contactId": 1,
  "recipientId": 2,
  "platform": "internal"
}

GET /api/share/received
Authorization: Bearer {token}

POST /api/share/generate-link
Authorization: Bearer {token}
Content-Type: application/json

{
  "contactId": 1,
  "platform": "whatsapp"
}

POST /api/share/import
Authorization: Bearer {token}
Content-Type: application/json

{
  "sharedContactId": 1
}
```

### Notifications

```http
GET /api/notifications
Authorization: Bearer {token}

GET /api/notifications/unread-count
Authorization: Bearer {token}

PUT /api/notifications/:id/read
Authorization: Bearer {token}

PUT /api/notifications/mark-all-read
Authorization: Bearer {token}

DELETE /api/notifications/:id
Authorization: Bearer {token}
```

## 🔌 WebSocket Events (Socket.IO)

### Connexion
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Événements disponibles

#### Envoyer un message
```javascript
socket.emit('message:send', {
  receiverId: 2,
  contenu: 'Bonjour!',
  typeMessage: 'text'
});
```

#### Recevoir un message
```javascript
socket.on('message:received', (message) => {
  console.log('Nouveau message:', message);
});
```

#### Partager un contact
```javascript
socket.emit('contact:share', {
  contactId: 1,
  recipientId: 2,
  platform: 'internal'
});
```

#### Recevoir un contact partagé
```javascript
socket.on('contact:shared', (data) => {
  console.log('Contact partagé:', data);
});
```

#### Indicateur de frappe
```javascript
// Démarrer
socket.emit('typing:start', { receiverId: 2 });

// Arrêter
socket.emit('typing:stop', { receiverId: 2 });

// Écouter
socket.on('typing:user', (data) => {
  console.log(`User ${data.userId} is typing:`, data.isTyping);
});
```

#### Marquer les messages comme lus
```javascript
socket.emit('messages:mark-read', { senderId: 2 });
```

#### Utilisateurs en ligne
```javascript
socket.on('users:online', (userIds) => {
  console.log('Utilisateurs en ligne:', userIds);
});
```

## 🗂️ Structure du Projet

```
MIA/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   └── seed.ts                # Script de seeding
├── src/
│   ├── controllers/           # Contrôleurs des routes
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── contactController.ts
│   │   ├── messageController.ts
│   │   ├── notificationController.ts
│   │   ├── roleController.ts
│   │   ├── permissionController.ts
│   │   ├── categorieController.ts
│   │   └── shareController.ts
│   ├── routes/                # Définition des routes
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── messageRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── roleRoutes.ts
│   │   ├── permissionRoutes.ts
│   │   ├── categorieRoutes.ts
│   │   └── shareRoutes.ts
│   ├── middlewares/           # Middlewares
│   │   ├── auth.ts
│   │   └── permissions.ts
│   ├── services/              # Services métier
│   │   └── socketService.ts
│   └── utils/                 # Utilitaires
│       ├── prismaClient.ts
│       └── jwt.ts
├── uploads/                   # Fichiers uploadés
├── index.ts                   # Point d'entrée
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 👥 Utilisateurs par défaut

Après le seeding, vous pouvez vous connecter avec:

**Admin:**
- Email: `admin@mia.com`
- Mot de passe: `admin123`

**Utilisateurs de test:**
- Email: `jean.dupont@mia.com` | Mot de passe: `password123`
- Email: `marie.martin@mia.com` | Mot de passe: `password123`
- Email: `pierre.bernard@mia.com` | Mot de passe: `password123`

## 🔗 Partage sur les Réseaux Sociaux

### WhatsApp
```javascript
const response = await fetch('/api/share/generate-link', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contactId: 1,
    platform: 'whatsapp'
  })
});

const { shareLink } = await response.json();
window.open(shareLink, '_blank');
```

### Telegram
```javascript
// Même principe avec platform: 'telegram'
```

### Facebook
```javascript
// Même principe avec platform: 'facebook'
```

### LinkedIn
```javascript
// Même principe avec platform: 'linkedin'
```

### Instagram
```javascript
// Pour Instagram, copiez le texte retourné
const { text } = await response.json();
navigator.clipboard.writeText(text);
```

## 🧪 Tests

```bash
# Tester la connexion à la base de données
npx prisma db pull

# Tester les migrations
npx prisma migrate dev

# Vérifier le schéma
npx prisma validate
```

## 🚀 Déploiement

### Prérequis
- Serveur avec Node.js
- PostgreSQL
- Nginx (recommandé)

### Étapes
1. Cloner le dépôt sur le serveur
2. Installer les dépendances
3. Configurer les variables d'environnement
4. Exécuter les migrations
5. Builder le projet: `npm run build`
6. Démarrer avec PM2: `pm2 start dist/index.js --name mia-api`

## 📝 Licence

ISC

## 👨‍💻 Auteur

MIA Team

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Support

Pour toute question ou problème, contactez: support@mia.com
