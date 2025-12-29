import * as brevo from '@getbrevo/brevo';

// Instance Brevo (sera initialisée au premier usage)
let apiInstance: brevo.TransactionalEmailsApi | null = null;

// Fonction pour obtenir l'instance Brevo
const getBrevoInstance = (): brevo.TransactionalEmailsApi => {
  if (!apiInstance) {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY non configurée dans les variables d\'environnement');
    }

    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return apiInstance;
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
 * Envoie un contact par email via Brevo
 * @param recipientEmail - Email du destinataire
 * @param contact - Données du contact à partager
 * @param senderName - Nom de l'expéditeur
 */
export const sendContactByEmail = async (
  recipientEmail: string,
  contact: ContactData,
  senderName: string
): Promise<void> => {
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

    const api = getBrevoInstance();

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL || 'saratasankara598@gmail.com',
      name: process.env.BREVO_SENDER_NAME || 'MIA'
    };
    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.subject = `📇 ${senderName} a partagé un contact avec vous`;
    sendSmtpEmail.htmlContent = contactHTML;
    sendSmtpEmail.textContent = contactText;

    const response = await api.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email de partage envoyé à ${recipientEmail} via Brevo`, response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email via Brevo:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration email est disponible
 */
export const isEmailConfigured = (): boolean => {
  return !!process.env.BREVO_API_KEY;
};
