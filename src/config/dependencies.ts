import { MailService } from '../services/MailService.js'
import { NodemailerProvider } from '../providers/NodemailerProvider.js'

const mailProvider = new NodemailerProvider()
export const mailService = new MailService(mailProvider)
