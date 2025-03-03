import { signinSchema, signupSchema } from '../middlewares/validator.js'
import { UserModel } from '../models/usersModel.js'
import { MailService } from '../services/MailService.js'
import { doHashing, compareHash, hmacHashing } from '../utils/hashing.js'
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor(private mailService: MailService) {}

  async signup(req, res) {
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

  signin = async (req, res) => {
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

  signout = async (req, res) => {
    res
      .clearCookie('Authorization')
      .status(200)
      .json({ message: 'Déconnexion réussie' })
  }

  sendVerificationCode = async (req, res) => {
    try {
      const { email } = req.body

      const user = await UserModel.findOne({ email })
        .select('+verificationCode')
        .select('+verified')

      if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' })
        return
      }

      if (user.verified) {
        res.status(400).json({ error: 'Utilisateur déjà vérifié' })
        return
      }

      // Générer un code aléatoire
      const verificationCode = Math.floor(100000 + Math.random() * 900000)

      console.log('Code de vérification :', verificationCode)

      // ✅ Envoyer le code par email avec `MailService`
      // await this.mailService.sendMail(
      //   user.email,
      //   'Votre code de vérification',
      //   `Bonjour,\n\nVotre code de vérification est : ${verificationCode}`
      // )

      const hashedCodeValue = await hmacHashing(
        verificationCode.toString(),
        process.env.HMAC_KEY
      )

      // ✅ Enregistrer le code dans la base de données
      await UserModel.findByIdAndUpdate(
        user._id,
        { verificationCode: hashedCodeValue },
        { verificationCodeValidation: Date.now() }
      )

      res.status(200).json({ message: 'Code envoyé avec succès' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erreur lors de l’envoi du code' })
    }
  }
}
