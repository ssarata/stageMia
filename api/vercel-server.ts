import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { setupSwagger } from './src/utils/swagger.js';

dotenv.config();

const app: Application = express();

// Configuration CORS - Ajoutez votre domaine Vercel ici
app.use(cors({
  origin: true, // Accepter toutes les origines en production (à ajuster selon vos besoins)
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads) - Note: limitée sur Vercel
app.use('/uploads', express.static('uploads'));

// Configuration de Swagger
setupSwagger(app);

// Routes principales
app.use('/api', routes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API MIA - Messaging and Interaction Application',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      contacts: '/api/contacts',
      messages: '/api/messages',
      notifications: '/api/notifications',
      roles: '/api/roles',
      permissions: '/api/permissions',
      categories: '/api/categories',
      share: '/api/share',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Export de l'app pour Vercel
export default app;
