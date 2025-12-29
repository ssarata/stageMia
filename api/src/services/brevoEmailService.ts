import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

// Initialiser Brevo
let apiInstance: brevo.TransactionalEmailsApi | null = null;

const getBrevoInstance = (): brevo.TransactionalEmailsApi => {
  if (!apiInstance) {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY non configurée dans les variables d\'environnement');
    }

    const apiKey = apiInstance = new brevo.TransactionalEmailsApi();
    apiKey.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  }
  return apiInstance;
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailParams) => {
  if (!process.env.BREVO_API_KEY) {
    console.warn('⚠️ BREVO_API_KEY non configurée - Email non envoyé (mode développement)');
    console.log(`Email à envoyer à ${to}: ${subject}`);
    return { messageId: 'dev-mode-no-email' };
  }

  try {
    const api = getBrevoInstance();

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL || 'saratasankara598@gmail.com',
      name: process.env.BREVO_SENDER_NAME || 'MIA'
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    if (text) {
      sendSmtpEmail.textContent = text;
    }

    const response = await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email envoyé avec succès via Brevo:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi de l\'email via Brevo:', error);
    throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string, name: string) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation du mot de passe</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 30px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 10px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Réinitialisation du mot de passe</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte.</p>

          <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>

          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </div>

          <p>Ou copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #4CAF50;">${resetUrl}</p>

          <div class="warning">
            <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure seulement.
          </div>

          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.</p>

          <p>Cordialement,<br>L'équipe MIA</p>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>&copy; ${new Date().getFullYear()} MIA - Gestion de Contacts. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html,
  });
};

export const sendPasswordResetConfirmationEmail = async (email: string, name: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de réinitialisation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 30px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .success {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Mot de passe réinitialisé</h1>
        </div>
        <div class="content">
          <p>Bonjour ${name},</p>

          <div class="success">
            <strong>Succès !</strong> Votre mot de passe a été réinitialisé avec succès.
          </div>

          <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>

          <p>Si vous n'êtes pas à l'origine de cette modification, contactez immédiatement l'administrateur système pour sécuriser votre compte.</p>

          <p>Cordialement,<br>L'équipe MIA</p>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>&copy; ${new Date().getFullYear()} MIA - Gestion de Contacts. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Votre mot de passe a été réinitialisé',
    html,
  });
};

export const sendNotificationEmail = async (
  userEmail: string,
  userName: string,
  notificationMessage: string,
  notificationType: string
) => {
  const typeColors: { [key: string]: string } = {
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  };

  const typeEmojis: { [key: string]: string } = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  const color = typeColors[notificationType] || typeColors.info;
  const emoji = typeEmojis[notificationType] || typeEmojis.info;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 30px;
        }
        .header {
          background-color: ${color};
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .notification-box {
          background-color: #f8f9fa;
          border-left: 4px solid ${color};
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${emoji} Nouvelle notification</h1>
        </div>
        <div class="content">
          <p>Bonjour ${userName},</p>

          <p>Vous avez reçu une nouvelle notification :</p>

          <div class="notification-box">
            <strong>${notificationMessage}</strong>
          </div>

          <p>Connectez-vous à votre compte MIA pour voir tous les détails.</p>

          <p>Cordialement,<br>L'équipe MIA</p>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>&copy; ${new Date().getFullYear()} MIA - Gestion de Contacts. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // En mode développement, envoyer à saratasankara598@gmail.com
  const isDevMode = process.env.NODE_ENV === 'development';
  const finalEmail = isDevMode ? 'saratasankara598@gmail.com' : userEmail;

  await sendEmail({
    to: finalEmail,
    subject: `${emoji} Notification - MIA`,
    html: html,
  });

  console.log(`📧 Email de notification envoyé à ${finalEmail}${isDevMode ? ` (destinataire prévu: ${userEmail})` : ''}`);
};

export default {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendNotificationEmail,
};
