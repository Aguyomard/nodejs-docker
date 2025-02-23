import dotenv from 'dotenv'
dotenv.config() // Charge les variables d'environnement en premier

import express, { Request, Response } from 'express'
import postRoutes from './routes/post.routes.js'
import mongoose from 'mongoose'

// Validation des variables d'environnement
if (!process.env.MONGO_URI) {
  throw new Error(
    "❌ Erreur : La variable d'environnement MONGO_URI est manquante."
  )
}

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const mongoURI = process.env.MONGO_URI

// Connexion à MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log('✅ MongoDB connecté avec succès !'))
  .catch((err: any) => {
    console.error('❌ Erreur de connexion à MongoDB :', err)
    process.exit(1) // Quitte le processus en cas d'échec
  })

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.get('/test', (req: Request, res: Response) => {
  res.json({ result: 100 + 100 })
})

app.use('/post', postRoutes)

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
