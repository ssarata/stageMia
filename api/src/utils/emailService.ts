import { Resend } from 'resend';

// Instance Resend (sera initialisée au premier usage)
let resend: Resend | null = null;

// Fonction pour obtenir l'instance Resend
const getResendInstance = (): Resend => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY non configurée dans les variables d\'environnement');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

interface ContactData {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  fonction?: string;
  organisation?: string;
  notes?: string;
}

/**
 * Envoie un contact par email
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
              <p><span class="label">Prénom:</span> ${contact.prenom}</p>
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
Prénom: ${contact.prenom}
Téléphone: ${contact.telephone}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.adresse ? `Adresse: ${contact.adresse}` : ''}
${contact.fonction ? `Fonction: ${contact.fonction}` : ''}
${contact.organisation ? `Organisation: ${contact.organisation}` : ''}
${contact.notes ? `Notes: ${contact.notes}` : ''}

---
Ce message a été envoyé automatiquement par MIA - Messaging and Interaction Application
    `.trim();

    const resendInstance = getResendInstance();
    const { data, error } = await resendInstance.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'MIA <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `📇 ${senderName} a partagé un contact avec vous`,
      text: contactText,
      html: contactHTML
    });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(error.message || 'Impossible d\'envoyer l\'email');
    }

    console.log(`✅ Email envoyé à ${recipientEmail}`, data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration email est disponible
 */
export const isEmailConfigured = (): boolean => {
  return !!process.env.RESEND_API_KEY;
};
