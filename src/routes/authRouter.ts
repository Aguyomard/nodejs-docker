import express from 'express'
import { AuthController } from '../controller/authController.js'
import { MailController } from '../controller/MailController.js'
import { mailService } from '../config/dependencies.js'

const router = express.Router()

const mailController = new MailController(mailService)

router.post('/signup', (req, res) => AuthController.signup(req, res))
router.get('/signin', (req, res) => AuthController.signin(req, res))
router.get('/signout', (req, res) => AuthController.signin(req, res))
router.get('/send-email', mailController.sendEmail)

export default router
