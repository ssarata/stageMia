# Guide de Déploiement MIA

Ce guide vous accompagne dans le déploiement de l'application MIA sur Railway (API) et Vercel (Frontend).

## 📋 Prérequis

- Compte GitHub
- Compte Railway (https://railway.app)
- Compte Vercel (https://vercel.com)
- Repository GitHub avec le code

## 🚂 Partie 1 : Déploiement de l'API sur Railway

### Étape 1 : Créer un projet Railway

1. Connectez-vous à [Railway](https://railw
ay.app)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Autorisez Railway à accéder à votre GitHub
5. Sélectionnez votre repository **stageMia**

### Étape 2 : Configurer le service API

1. Railway détectera automatiquement le dossier `api`
2. Dans les paramètres du service :
   - **Root Directory** : `/api`
   - **Build Command** : `npm install && npx prisma generate && npm run build`
   - **Start Command** : `npx prisma migrate deploy && npm start`

### Étape 3 : Ajouter la base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database" → "PostgreSQL"**
3. Railway créera automatiquement la base de données
4. La variable `DATABASE_URL` sera ajoutée automatiquement

### Étape 4 : Configurer les variables d'environnement

Dans Railway, allez dans **Variables** et ajoutez :

```bash
# JWT Configuration
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail)
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_gmail

# Frontend URL (sera ajouté après déploiement Vercel)
FRONTEND_URL=https://votre-app.vercel.app

# Node Environment
NODE_ENV=production
```

> **Note** : `DATABASE_URL` et `PORT` sont automatiquement fournis par Railway

### Étape 5 : Déployer l'API

1. Railway déploiera automatiquement après la configuration
2. Vous recevrez une URL publique (ex: `https://votre-api.up.railway.app`)
3. **Copiez cette URL**, vous en aurez besoin pour le frontend

### Étape 6 : Tester l'API

Visitez : `https://votre-api.up.railway.app/`

Vous devriez voir :
```json
{
  "message": "Bienvenue sur l'API MIA - Messaging and Interaction Application",
  "version": "1.0.0",
  "documentation": "/api-docs"
}
```

## ▲ Partie 2 : Déploiement du Frontend sur Vercel

### Étape 1 : Créer un projet Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur **"Add New..." → "Project"**
3. Importez votre repository GitHub **stageMia**

### Étape 2 : Configurer le projet Frontend

Dans les paramètres de build :

- **Framework Preset** : Vite
- **Root Directory** : `front`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

### Étape 3 : Configurer les variables d'environnement

Dans **Environment Variables**, ajoutez :

```bash
VITE_API_URL=https://votre-api.up.railway.app
```

Remplacez `https://votre-api.up.railway.app` par l'URL Railway obtenue à l'étape 1.5

### Étape 4 : Déployer le Frontend

1. Cliquez sur **"Deploy"**
2. Vercel construira et déploiera automatiquement
3. Vous recevrez une URL (ex: `https://votre-app.vercel.app`)

### Étape 5 : Mettre à jour CORS dans l'API

1. Retournez sur Railway
2. Ajoutez/Modifiez la variable d'environnement :
   ```bash
   FRONTEND_URL=https://votre-app.vercel.app
   ```
3. Railway redéploiera automatiquement l'API

## ✅ Vérification du Déploiement

### Tester l'API

```bash
curl https://votre-api.up.railway.app/api/health
```

### Tester le Frontend

1. Visitez `https://votre-app.vercel.app`
2. Essayez de vous connecter
3. Testez le chat en temps réel (WebSocket)

## 🔄 Déploiements Automatiques

### Déploiement automatique activé pour :

- **Railway** : Déploie automatiquement à chaque push sur `main`
- **Vercel** : Déploie automatiquement à chaque push sur `main`

Vos GitHub Actions sont déjà configurées dans `.github/workflows/deploy.yml`

## 📊 Surveillance et Logs

### Railway
- Logs en temps réel : Dashboard Railway → Votre service → Logs
- Métriques : CPU, RAM, Network

### Vercel
- Analytics : Dashboard Vercel → Analytics
- Logs de build : Deployments → Logs

## 💰 Coûts

### Railway (Plan Starter - Gratuit)
- $5 de crédit gratuit/mois
- Paiement à l'usage ensuite
- ~$5-10/mois pour une petite app

### Vercel (Plan Hobby - Gratuit)
- 100 GB de bande passante
- Builds illimités
- Domaine personnalisé gratuit

## 🔧 Dépannage

### L'API ne démarre pas
1. Vérifiez les logs Railway
2. Assurez-vous que `DATABASE_URL` est bien configuré
3. Vérifiez que Prisma migrations se sont exécutées

### Le Frontend ne se connecte pas à l'API
1. Vérifiez `VITE_API_URL` dans Vercel
2. Vérifiez `FRONTEND_URL` dans Railway
3. Testez l'API directement avec curl

### WebSocket ne fonctionne pas
1. Railway supporte nativement WebSocket
2. Vérifiez que Socket.IO est bien initialisé
3. Consultez les logs Railway pour erreurs Socket.IO

## 📝 Commandes Utiles

### Logs Railway
```bash
railway logs
```

### Redéployer Railway
```bash
railway up
```

### Redéployer Vercel
```bash
vercel --prod
```

## 🎉 Félicitations !

Votre application MIA est maintenant déployée et accessible publiquement !

- **API** : https://votre-api.up.railway.app
- **Frontend** : https://votre-app.vercel.app
- **Documentation** : https://votre-api.up.railway.app/api-docs
