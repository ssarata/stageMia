import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MIA - Messaging and Interaction Application API',
      version: '1.0.0',
      description: `
# MIA API Documentation

API complète pour la gestion des contacts, messagerie instantanée et partage sur les réseaux sociaux.

## Fonctionnalités principales

- 🔐 Authentification JWT
- 👥 Gestion des utilisateurs et profils
- 📇 CRUD complet des contacts
- 💬 Messagerie en temps réel (Socket.IO)
- 🔗 Partage de contacts sur réseaux sociaux
- 🔔 Notifications en temps réel
- 👮 Système de rôles et permissions
- 📱 Validation internationale des numéros de téléphone

## Authentification

La plupart des endpoints nécessitent une authentification JWT.

Pour vous authentifier:
1. Obtenez un token via \`POST /api/auth/login\`
2. Incluez le token dans l'header: \`Authorization: Bearer {token}\`

## Codes d'erreur

- \`200\` - Succès
- \`201\` - Créé avec succès
- \`400\` - Requête invalide
- \`401\` - Non authentifié
- \`403\` - Permission refusée
- \`404\` - Ressource introuvable
- \`500\` - Erreur serveur

## Support

Pour toute question, consultez le README.md du projet.
      `,
      contact: {
        name: 'MIA Support',
        email: 'support@mia.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.mia.com',
        description: 'Serveur de production'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints d\'authentification et inscription'
      },
      {
        name: 'Users',
        description: 'Gestion des utilisateurs'
      },
      {
        name: 'Contacts',
        description: 'Gestion des contacts'
      },
      {
        name: 'Messages',
        description: 'Messagerie instantanée'
      },
      {
        name: 'Share',
        description: 'Partage de contacts'
      },
      {
        name: 'Notifications',
        description: 'Gestion des notifications'
      },
      {
        name: 'Categories',
        description: 'Catégories de contacts'
      },
      {
        name: 'Roles',
        description: 'Gestion des rôles (Admin)'
      },
      {
        name: 'Permissions',
        description: 'Gestion des permissions (Admin)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/auth/login'
        }
      },
      schemas: {
        // Schémas de base
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur'
            },
            nom: {
              type: 'string',
              description: 'Nom de famille'
            },
            prenom: {
              type: 'string',
              description: 'Prénom'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email unique'
            },
            telephone: {
              type: 'string',
              description: 'Numéro de téléphone au format international (+226...)'
            },
            adresse: {
              type: 'string',
              description: 'Adresse physique'
            },
            sexe: {
              type: 'string',
              enum: ['M', 'F', 'Autre'],
              description: 'Sexe de l\'utilisateur'
            },
            roleId: {
              type: 'integer',
              description: 'ID du rôle'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nom: {
              type: 'string'
            },
            prenom: {
              type: 'string'
            },
            telephone: {
              type: 'string',
              description: 'Format international (+226...)'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            adresse: {
              type: 'string'
            },
            fonction: {
              type: 'string',
              description: 'Fonction professionnelle'
            },
            organisation: {
              type: 'string',
              description: 'Entreprise ou organisation'
            },
            notes: {
              type: 'string',
              description: 'Notes personnelles'
            },
            categorieId: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            typeMessage: {
              type: 'string',
              enum: ['text', 'contact', 'file'],
              description: 'Type de message'
            },
            contenu: {
              type: 'string',
              description: 'Contenu du message'
            },
            dateEnvoi: {
              type: 'string',
              format: 'date-time'
            },
            lu: {
              type: 'boolean',
              description: 'Message lu ou non'
            },
            senderId: {
              type: 'integer'
            },
            receiverId: {
              type: 'integer'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            message: {
              type: 'string'
            },
            date: {
              type: 'string',
              format: 'date-time'
            },
            lu: {
              type: 'boolean'
            },
            type: {
              type: 'string',
              enum: ['info', 'success', 'warning', 'error']
            },
            userId: {
              type: 'integer'
            }
          }
        },
        Categorie: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nomCategorie: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nomRole: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Permission: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nomPermission: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            details: {
              type: 'object',
              description: 'Détails supplémentaires sur l\'erreur'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js',
    './index.ts'
  ] // Chemin vers les fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MIA API Documentation',
    customfavIcon: '/favicon.ico'
  }));

  // JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};

export default setupSwagger;
