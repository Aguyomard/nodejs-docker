import express, { Request, Response } from 'express'
import postRoutes from './routes/post.routes.js'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 3000

const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/mydatabase'

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log('✅ MongoDB connecté avec succès !'))
  .catch((err: any) => console.error('❌ Erreur de connexion à MongoDB :', err))

app.get('/test', (req: Request, res: Response) => {
  res.json({ result: 100 + 100 })
})

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/post', postRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
