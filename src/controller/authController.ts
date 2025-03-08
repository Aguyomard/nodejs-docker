import { Request, Response, NextFunction } from 'express'
import {
  acceptCodeSchema,
  signinSchema,
  signupSchema,
} from '../models/validator.js'
import { UserModel } from '../models/usersModel.js'
import { MailService } from '../services/MailService.js'
import {
  doHashing,
  compareHash,
  hmacHashing,
  hmacCompare,
} from '../utils/hashing.js'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler.js'

export class AuthController {
  constructor(private mailService: MailService) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const { error } = signupSchema.validate({ email, password })

      if (error) {
        return next(new AppError(error.details[0].message, 400))
      }

      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        return next(new AppError('Cet email est déjà utilisé', 400))
      }

      const hashedPassword = await doHashing(password)
      const newUser = new UserModel({ email, password: hashedPassword })
      const result = await newUser.save()

      res.status(201).json({
        user: result,
        success: true,
        message: 'Utilisateur créé avec succès',
      })
    } catch (error) {
      console.log(error)
      next(new AppError('Erreur lors de la création de l’utilisateur', 500))
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const { error } = signinSchema.validate({ email, password })

      if (error) {
        return next(new AppError('Données invalides', 400))
      }

      const user = await UserModel.findOne({ email }).select('+password')
      if (!user) {
        return next(new AppError('Utilisateur non trouvé', 404))
      }

      const isPasswordValid = await compareHash(password, user.password)
      if (!isPasswordValid) {
        return next(new AppError('Mot de passe incorrect', 401))
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, verified: user.verified },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      )

      res.cookie('Authorization', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 3600000),
      })

      res.status(200).json({
        user,
        success: true,
        message: 'Connexion réussie',
        token,
      })
    } catch (error) {
      console.log(error)
      next(new AppError('Erreur lors de la connexion', 500))
    }
  }

  async signout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie('Authorization')
        .status(200)
        .json({ message: 'Déconnexion réussie' })
    } catch (error) {
      console.log(error)
      next(new AppError('Erreur lors de la déconnexion', 500))
    }
  }

  async sendVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const user = await UserModel.findOne({ email })
        .select('+verificationCode')
        .select('+verified')

      if (!user) {
        return next(new AppError('Utilisateur non trouvé', 404))
      }

      if (user.verified) {
        return next(new AppError('Utilisateur déjà vérifié', 400))
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000)

      console.log('Code de vérification :', verificationCode)

      await this.mailService.sendMail(
        user.email,
        'Votre code de vérification',
        `Bonjour,\n\nVotre code de vérification est : ${verificationCode}`
      )

      const hashedCodeValue = await hmacHashing(
        verificationCode.toString(),
        process.env.HMAC_KEY!
      )

      await UserModel.findByIdAndUpdate(user._id, {
        verificationCode: hashedCodeValue,
        verificationCodeValidationDate: new Date(),
      })

      res.status(200).json({ message: 'Code envoyé avec succès' })
    } catch (error) {
      console.log(error)
      next(new AppError('Erreur lors de l’envoi du code', 500))
    }
  }

  async verifyVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, code } = req.body
      const { error } = acceptCodeSchema.validate({ email, code })

      if (error) {
        return next(new AppError('Données invalides', 400))
      }

      const user = await UserModel.findOne({ email }).select(
        '+verificationCode +verificationCodeValidationDate'
      )

      if (!user) {
        return next(new AppError('Utilisateur non trouvé', 404))
      }

      if (!user.verificationCode) {
        return next(new AppError('Aucun code de vérification trouvé', 400))
      }

      if (
        !user.verificationCodeValidationDate ||
        Date.now() - user.verificationCodeValidationDate.getTime() > 600000
      ) {
        return next(new AppError('Code expiré', 400))
      }

      const isValid = await hmacCompare(
        code.toString(),
        user.verificationCode,
        process.env.HMAC_KEY!
      )

      if (!isValid) {
        return next(new AppError('Code invalide', 400))
      }

      await UserModel.findByIdAndUpdate(user._id, {
        verified: true,
        verificationCode: null,
        verificationCodeValidationDate: null,
      })

      res.status(200).json({ message: 'Utilisateur vérifié avec succès' })
    } catch (error) {
      console.log(error)
      next(new AppError('Erreur lors de la vérification du code', 500))
    }
  }
}
