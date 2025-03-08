import { createTransporter } from '../config/emailConfig.js'
import { MailProvider } from './MailProvider.js'

export class NodemailerProvider implements MailProvider {
  private transporter = createTransporter()

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: 'app@example.com',
      to,
      subject,
      text,
    })
  }
}
