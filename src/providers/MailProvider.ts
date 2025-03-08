export interface MailProvider {
  sendMail(to: string, subject: string, text: string): Promise<void>
}
