import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import postRoutes from './routes/post.routes.js'
import authRouter from './routes/authRouter.js'
import connectDB from './config/db.js'
import { errorHandler } from './middlewares/errorHandler.js'

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// Middlewares
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.get('/test', (req, res) => {
  res.json({ result: 101 })
})

app.use('/post', postRoutes)
app.use('/api/auth', authRouter)

// Gestion des erreurs
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Échec du démarrage du serveur :', error)
    process.exit(1)
  }
}

startServer()
