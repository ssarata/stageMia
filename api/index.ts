import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { initializeSocket } from './src/services/socketService.js';
import { setupSwagger } from './src/utils/swagger.js';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Configuration CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:4000',
  'https://stage-mia-gnru.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origin (comme Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.includes('vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24 heures
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Configuration de Swagger
setupSwagger(app);

// Routes principales
app.use('/api', routes);

// Initialiser Socket.IO pour le chat en temps réel
const io = initializeSocket(httpServer);

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

const PORT = parseInt(process.env.PORT || '3000', 10);

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 MIA - Messaging and Interaction Application         ║
║                                                           ║
║   📡 Serveur démarré sur: http://localhost:${PORT}        ║
║   💬 WebSocket activé pour le chat en temps réel         ║
║   📚 Documentation Swagger: http://localhost:${PORT}/api-docs ║
║   📖 API JSON Spec: http://localhost:${PORT}/api-docs.json    ║
║   ❤️  Health Check: /api/health                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export { io };
