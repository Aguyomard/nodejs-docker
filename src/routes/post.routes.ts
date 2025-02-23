import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

router.post('/', (req, res) => {
  res.json({ message: req.body.test })
})

router.put('/:id', (req, res) => {
  res.json({ message: req.params.id })
})

router.delete('/:id', (req, res) => {
  res.json({ message: req.params.id })
})

router.patch('/:id', (req, res) => {
  res.json({ message: req.params.id })
})

export default router
