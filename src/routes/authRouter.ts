import express from 'express'
import { AuthController } from '../controller/authController.js'
import { MailController } from '../controller/MailController.js'
import { mailService } from '../config/dependencies.js'
import identifier from '../middlewares/identification.js'

const router = express.Router()

const mailController = new MailController(mailService)
const authController = new AuthController(mailService)

router.post('/signup', (req, res, next) =>
  authController.signup(req, res, next)
)
router.get('/signin', (req, res, next) => authController.signin(req, res, next))
router.get('/signout', identifier, (req, res, next) =>
  authController.signout(req, res, next)
)
router.get('/send-email', (req, res, next) =>
  mailController.sendEmail(req, res, next)
)
router.patch('/verify-code', (req, res, next) =>
  authController.sendVerificationCode(req, res, next)
)
router.patch('/verify-verification-code', (req, res, next) =>
  authController.verifyVerificationCode(req, res, next)
)
router.patch('/change-password', identifier, (req, res, next) =>
  authController.changePassword(req, res, next)
)

export default router
