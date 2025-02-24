import express from 'express'
import { AuthController } from '../controller/authController.js'

const router = express.Router()

router.post('/signup', (req, res) => AuthController.signup(req, res))

export default router
