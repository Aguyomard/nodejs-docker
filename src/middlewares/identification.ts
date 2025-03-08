import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'

const identifier = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined = undefined

    if (req.headers.client === 'not-browser') {
      token = req.headers.authorization
      console.log('Token reçu via Header:', token)
    } else {
      token = req.cookies['Authorization']
      console.log('Token reçu via Cookie:', token)
    }

    if (!token) {
      throw new AppError(
        'Vous devez être identifié pour accéder à cette ressource',
        401
      )
    }

    const tokenParts = token.split(' ')
    const userToken = tokenParts.length > 1 ? tokenParts[1] : tokenParts[0]

    const decoded = jwt.verify(userToken, process.env.JWT_SECRET!)

    if (!decoded) {
      throw new AppError('Token invalide', 401)
    }

    // Ajouter les informations de l'utilisateur au `req`
    req.user = decoded

    next()
  } catch (error) {
    console.error('❌ Erreur d’authentification:', error)
    next(new AppError('Authentification échouée', 401))
  }
}

export default identifier
