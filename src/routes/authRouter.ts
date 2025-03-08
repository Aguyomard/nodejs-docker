import express from 'express'
import { AuthController } from '../controller/authController.js'
import { MailController } from '../controller/MailController.js'
import { mailService } from '../config/dependencies.js'

const router = express.Router()

const mailController = new MailController(mailService)
const authController = new AuthController(mailService)

router.post('/signup', (req, res) => authController.signup(req, res))
router.get('/signin', (req, res) => authController.signin(req, res))
router.get('/signout', (req, res) => authController.signout(req, res))
router.get('/send-email', mailController.sendEmail)
router.patch('/verify-code', authController.sendVerificationCode)
router.patch('/verify-verification-code', authController.verifyVerificationCode)

export default router
