import exp from 'constants'
import { signinSchema, signupSchema } from '../middlewares/validator.js'
import { UserModel } from '../models/usersModel.js'
import { doHashing, compareHash } from '../utils/hashing.js'
import jwt from 'jsonwebtoken'

export class AuthController {
  static async signup(req, res) {
    try {
      const { email, password } = req.body
      const { error } = signupSchema.validate({ email, password })

      if (error) {
        res
          .status(400)
          .json({ error: error.details[0].message, success: false })
        return
      }

      const existingUser = await UserModel.findOne({
        email,
      })

      if (existingUser) {
        res
          .status(400)
          .json({ error: 'Cet email est déjà utilisé', success: false })
        return
      }

      const hashedPassword = await doHashing(password)

      const newUser = new UserModel({ email, password: hashedPassword })

      const result = await newUser.save()

      res.status(201).json({
        user: result,
        success: true,
        message: 'Utilisateur créé avec succès',
      })
    } catch {
      res.status(500).json({ error: 'Erreur lors de la création du post' })
    }
  }

  static signin = async (req, res) => {
    try {
      const { email, password } = req.body
      const { error } = signinSchema.validate({ email, password })

      if (error) {
        res.status(400).json({ error: error, success: false })
        return
      }

      const user = await UserModel.findOne({
        email,
      }).select('+password')

      if (!user) {
        res
          .status(404)
          .json({ error: 'Utilisateur non trouvé', success: false })
        return
      }

      const isPasswordValid = await compareHash(password, user.password)

      if (!isPasswordValid) {
        res
          .status(401)
          .json({ error: 'Mot de passe incorrect', success: false })
        return
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, verified: user.verified },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      )

      res.cookie('Authorization', token, {
        httpOnly: true, // Empêche l’accès au cookie via JavaScript (protection contre XSS)
        secure: process.env.NODE_ENV === 'production', // Active uniquement en HTTPS en production
        sameSite: 'Strict', // Empêche les requêtes cross-site (évite les CSRF)
        expires: new Date(Date.now() + 3600000), // Expire après 1h
      })

      res.status(200).json({
        user,
        success: true,
        message: 'Connexion réussie',
        token: token,
      })
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion' })
    }
  }
}
