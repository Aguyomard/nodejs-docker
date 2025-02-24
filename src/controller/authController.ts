import { signupSchema } from '../middlewares/validator.js'
import { UserModel } from '../models/usersModel.js'
import { doHashing } from '../utils/hashing.js'

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

      res.status(201).json({ user: result, success: true })
    } catch {
      res.status(500).json({ error: 'Erreur lors de la création du post' })
    }
  }
}
