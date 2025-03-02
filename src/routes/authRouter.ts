import express from 'express'
import { AuthController } from '../controller/authController.js'

const router = express.Router()

router.post('/signup', (req, res) => AuthController.signup(req, res))
router.get('/signin', (req, res) => AuthController.signin(req, res))
router.get('/signout', (req, res) => AuthController.signin(req, res))
router.get('/mail', (req, res) => AuthController.mail(req, res))

export default router
