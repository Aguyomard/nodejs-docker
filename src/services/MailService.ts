import { MailProvider } from '../providers/MailProvider.js'

export class MailService {
  constructor(private provider: MailProvider) {}

  async sendMail(to: string, subject: string, text: string) {
    return this.provider.sendMail(to, subject, text)
  }
}
