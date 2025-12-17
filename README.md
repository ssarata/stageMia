# 🌍 Application MIA - Messaging and Interaction Application

Application de gestion de contacts avec système de messagerie en temps réel, développée avec React, Node.js, PostgreSQL et WebSocket.

## 🚀 Démarrage Rapide

### Option 1 : Docker (Recommandé pour le déploiement)

```bash
./deploy.sh
```

C'est tout ! L'application sera accessible sur http://localhost

📖 **Guide détaillé** : [QUICKSTART.md](./QUICKSTART.md)

### Option 2 : Développement local

#### Backend (API)
```bash
cd api
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

#### Frontend
```bash
cd front
npm install
npm run dev
```

## 📋 Fonctionnalités

### ✅ Gestion des Contacts
- Création, modification, suppression de contacts
- Catégorisation des contacts
- Recherche et filtrage avancés
- Export de contacts

### 👥 Gestion des Utilisateurs
- Système d'authentification JWT
- **Rôles et permissions (RBAC)**
  - **ADMIN** : Accès complet au système
  - **MIA** : Personnel MIA avec droits étendus
  - **LECTEUR** : Accès en lecture seule
- **Attribution de rôles** (Admin uniquement)
- Profils utilisateurs

### 💬 Messagerie en temps réel
- Chat en temps réel avec WebSocket
- Notifications instantanées
- Historique des messages

### 🔐 Sécurité
- Authentification JWT avec refresh token
- Système de permissions granulaire
- Protection des routes API et frontend
- Validation des données

### 🎨 Interface Utilisateur
- Interface moderne avec React et TailwindCSS
- Components UI avec shadcn/ui
- Tableaux interactifs avec AG-Grid
- Mode sombre/clair
- Responsive design

## 🏗️ Architecture

```
├── api/                    # Backend Node.js + Express
│   ├── prisma/            # Schéma et migrations Prisma
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   ├── routes/        # Routes API
│   │   ├── middlewares/   # Auth, permissions, RBAC
│   │   ├── utils/         # Utilitaires (JWT, notifications)
│   │   └── index.ts       # Point d'entrée
│   └── Dockerfile         # Image Docker API
│
├── front/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/    # Composants React
│   │   │   ├── Global/    # Composants réutilisables
│   │   │   │   └── ProtectedAction.tsx  # Protection basée sur permissions
│   │   │   └── privates/  # Pages protégées
│   │   ├── hooks/         # Hooks personnalisés
│   │   │   ├── usePermissions.ts       # Hook RBAC
│   │   │   └── private/   # Hooks API (React Query)
│   │   ├── store/         # État global (Zustand)
│   │   └── axios/         # Configuration Axios
│   ├── nginx.conf         # Config nginx pour production
│   └── Dockerfile         # Image Docker Frontend
│
├── docker-compose.yml     # Orchestration Docker
├── deploy.sh             # Script de déploiement automatique
├── test-docker.sh        # Script de test
├── Makefile              # Commandes simplifiées
└── README.docker.md      # Documentation Docker complète
```

## 🛠️ Technologies

### Backend
- **Node.js** 22 + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **Socket.io** - WebSocket pour temps réel
- **JWT** - Authentification
- **Swagger** - Documentation API

### Frontend
- **React** 18 + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Components UI
- **React Query** - Gestion état serveur
- **Zustand** - Gestion état client
- **AG-Grid** - Tableaux avancés
- **Axios** - HTTP client

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** - Serveur web (production)
- **Prisma Migrate** - Migrations DB

## 📦 Déploiement

### Avec Docker (Production)

```bash
# Déploiement complet en une commande
./deploy.sh

# Ou étape par étape avec Make
make deploy

# Ou manuellement
docker-compose up -d
```

📖 **Documentation complète** : [README.docker.md](./README.docker.md)

### Sans Docker (Développement)

Voir la section "Développement local" ci-dessus.

## 🔑 Identifiants par défaut

Après l'initialisation (seed) :

```
Email:       admin@mia.com
Mot de passe: admin123
```

## 📊 Commandes Utiles

```bash
make help           # Voir toutes les commandes
make deploy         # Déployer l'application
make test           # Tester l'installation
make logs           # Voir les logs
make health         # Vérifier la santé
make restart        # Redémarrer
make down           # Arrêter
make studio         # Interface DB (Prisma Studio)
make backup-db      # Sauvegarder la DB
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | Interface utilisateur |
| API | http://localhost:3000 | Backend REST API |
| Swagger | http://localhost:3000/api-docs | Documentation API interactive |
| Health | http://localhost:3000/api/health | Status de l'API |

## 🎯 Système RBAC (Contrôle d'accès basé sur les rôles)

### Rôles disponibles

- **ADMIN** : Accès complet (36 permissions)
- **MIA** : Personnel MIA (16 permissions)
- **LECTEUR** : Lecture seule (2 permissions)

### Permissions par ressource

#### Contacts
- `contact.read`, `contact.create`, `contact.update`, `contact.delete`, `contact.export`

#### Utilisateurs
- `user.read`, `user.create`, `user.update`, `user.delete`

#### Catégories, Rôles, Messages, Notifications, etc.
- Format : `{resource}.{action}` (ex: `role.create`, `notification.read`)

### Utilisation frontend

```tsx
import { ProtectedAction } from "@/components/Global/ProtectedAction";
import { usePermissions } from "@/hooks/usePermissions";

// Cacher un bouton selon la permission
<ProtectedAction permission="contact.create">
  <Button>Nouveau contact</Button>
</ProtectedAction>

// Vérifier dans le code
const { hasPermission, isAdmin } = usePermissions();
if (hasPermission('user.delete')) {
  // ...
}
```

📖 **Guide complet** : [front/src/EXEMPLES_RBAC_FRONTEND.md](./front/src/EXEMPLES_RBAC_FRONTEND.md)

## 🔐 Sécurité

### En développement
- Token JWT stocké dans cookie HttpOnly
- CORS configuré pour `localhost`
- Variables d'environnement dans `.env`

### En production
⚠️ **Important** : Modifier ces valeurs dans `.env` :

```env
JWT_SECRET=votre-secret-unique-et-securise
JWT_REFRESH_SECRET=votre-refresh-secret-unique
POSTGRES_PASSWORD=mot-de-passe-fort
VITE_API_URL=https://api.votre-domaine.com
```

Recommandations :
- ✅ Utiliser HTTPS avec SSL/TLS
- ✅ Configurer CORS strictement
- ✅ Limiter l'exposition des ports
- ✅ Mettre en place des sauvegardes automatiques
- ✅ Activer les logs de sécurité

## 🧪 Tests

```bash
# Tester le déploiement Docker
./test-docker.sh

# Ou avec Make
make test

# Vérifier la santé des services
make health
```

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage rapide
- [README.docker.md](./README.docker.md) - Documentation Docker complète
- [front/src/EXEMPLES_RBAC_FRONTEND.md](./front/src/EXEMPLES_RBAC_FRONTEND.md) - Guide RBAC Frontend
- [Makefile](./Makefile) - Commandes disponibles (`make help`)

## 🐛 Dépannage

### Problèmes courants

#### Les services ne démarrent pas
```bash
docker-compose logs        # Voir les erreurs
make rebuild              # Reconstruire les images
```

#### Erreur de base de données
```bash
make logs-db              # Logs PostgreSQL
make migrate              # Réappliquer les migrations
```

#### L'API ne répond pas
```bash
make logs-api             # Logs API
make restart-api          # Redémarrer l'API
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence privée.

## 👥 Auteurs

- **Équipe MIA** - Développement et maintenance

## 🎉 Remerciements

- shadcn/ui pour les composants
- Prisma pour l'ORM
- La communauté Open Source

---

**Besoin d'aide ?** Consultez la documentation ou ouvrez une issue.
