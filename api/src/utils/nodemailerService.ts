import * as nodemailer from 'nodemailer';

// Créer le transporteur Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    // Configurer des timeouts raisonnables pour éviter les blocages en production
    connectionTimeout: 10000, // 10 secondes pour la connexion
    greetingTimeout: 10000,   // 10 secondes pour le greeting
    socketTimeout: 30000,     // 30 secondes pour les opérations socket
  });
};

interface ContactData {
  nom: string;
  prenom: string | null;
  telephone: string;
  email?: string | null;
  adresse?: string | null;
  fonction?: string | null;
  organisation?: string | null;
  notes?: string | null;
}

/**
 * Envoie un contact par email via Nodemailer
 * @param recipientEmail - Email du destinataire
 * @param contact - Données du contact à partager
 * @param senderName - Nom de l'expéditeur
 */
export const sendContactByEmail = async (
  recipientEmail: string,
  contact: ContactData,
  senderName: string
): Promise<void> => {
  // En mode développement, envoyer à l'email de test au lieu de l'email réel
  const isDevMode = process.env.NODE_ENV === 'development';
  const devEmail = 'saratasankara598@gmail.com';
  const actualRecipient = isDevMode ? devEmail : recipientEmail;

  try {
    const contactHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .contact-info {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
          }
          .contact-info p {
            margin: 8px 0;
          }
          .label {
            font-weight: bold;
            color: #4CAF50;
          }
          .footer {
            text-align: center;
            padding: 15px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📇 Contact partagé via MIA</h2>
          </div>
          <div class="content">
            ${isDevMode ? `<div style="background-color: #e3f2fd; padding: 10px; margin: 15px 0; border-radius: 5px;">
              <strong>📧 [MODE DEV]</strong> Destinataire prévu: ${recipientEmail}
            </div>` : ''}
            <p>Bonjour,</p>
            <p><strong>${senderName}</strong> a partagé un contact avec vous via l'application MIA.</p>

            <div class="contact-info">
              <h3>Informations du contact :</h3>
              <p><span class="label">Nom:</span> ${contact.nom}</p>
              <p><span class="label">Prénom:</span> ${contact.prenom || 'N/A'}</p>
              <p><span class="label">Téléphone:</span> ${contact.telephone}</p>
              ${contact.email ? `<p><span class="label">Email:</span> ${contact.email}</p>` : ''}
              ${contact.adresse ? `<p><span class="label">Adresse:</span> ${contact.adresse}</p>` : ''}
              ${contact.fonction ? `<p><span class="label">Fonction:</span> ${contact.fonction}</p>` : ''}
              ${contact.organisation ? `<p><span class="label">Organisation:</span> ${contact.organisation}</p>` : ''}
              ${contact.notes ? `<p><span class="label">Notes:</span> ${contact.notes}</p>` : ''}
            </div>

            <p style="margin-top: 20px;">Vous pouvez ajouter ce contact à votre liste de contacts personnelle.</p>
          </div>
          <div class="footer">
            <p>Ce message a été envoyé automatiquement par MIA - Messaging and Interaction Application</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const contactText = `
Contact partagé via MIA
========================

${senderName} a partagé un contact avec vous :

Nom: ${contact.nom}
Prénom: ${contact.prenom || 'N/A'}
Téléphone: ${contact.telephone}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.adresse ? `Adresse: ${contact.adresse}` : ''}
${contact.fonction ? `Fonction: ${contact.fonction}` : ''}
${contact.organisation ? `Organisation: ${contact.organisation}` : ''}
${contact.notes ? `Notes: ${contact.notes}` : ''}

---
Ce message a été envoyé automatiquement par MIA - Messaging and Interaction Application
    `.trim();

    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.GMAIL_SENDER_NAME || 'MIA-BF'} <${process.env.GMAIL_USER}>`,
      to: actualRecipient,
      subject: `📇 ${senderName} a partagé un contact avec vous`,
      html: contactHTML,
      text: contactText,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevMode) {
      console.log(`📧 [DEV] Email envoyé à ${actualRecipient} (destinataire prévu: ${recipientEmail})`, info.messageId);
    } else {
      console.log(`✅ [PROD] Email de partage envoyé à ${recipientEmail} via Nodemailer`, info.messageId);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email via Nodemailer:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration email est disponible
 */
export const isEmailConfigured = (): boolean => {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
};
