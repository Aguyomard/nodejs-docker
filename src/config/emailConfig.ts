import nodemailer from 'nodemailer'

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:
        process.env.NODE_CODE_SENDING_EMAIL_ADDRESS || 'test@ethereal.email',
      pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD || 'password',
    },
  })
}
