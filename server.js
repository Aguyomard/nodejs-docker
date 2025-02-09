import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ result: 1 + 100 })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
