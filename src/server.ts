import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import postRoutes from './routes/post.routes.js'
import connectDB from './config/db.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.get('/test', (req: Request, res: Response) => {
  res.json({ result: 100 + 100 })
})

app.use('/post', postRoutes)

// Fonction pour démarrer le serveur après la connexion à MongoDB
const startServer = async () => {
  try {
    await connectDB() // Attendre la connexion à la base de données
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Échec du démarrage du serveur :', error)
    process.exit(1) // Quitte le processus en cas d'échec
  }
}

startServer() // Démarrer l'application proprement
