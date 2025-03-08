import { NextFunction, Request, Response } from 'express'
import { MailService } from '../services/MailService.js'

export class MailController {
  constructor(private mailService: MailService) {
    this.sendEmail = this.sendEmail.bind(this)
  }

  async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await this.mailService.sendMail(
        req.body.to,
        req.body.subject,
        req.body.text
      )
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
