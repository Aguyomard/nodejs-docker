import nodemailer from 'nodemailer'

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
  },
})

// Fonction pour envoyer un email
export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const info = await transporter.sendMail({
      from: '"Mon Application" alecloic@msn.com',
      to,
      subject,
      text,
      html,
    })

    console.log('Email envoyé : %s', info.messageId)
    return info
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
    throw error
  }
}
