import express from 'express'
import { PostController } from '../controller/post.controller.js'

const router = express.Router()

router.get('/', (req, res) => PostController.getAllPosts(req, res))
router.post('/', (req, res) => PostController.createPost(req, res))
router.put('/:id', (req, res) => PostController.updatePost(req, res))
router.patch('/:id', (req, res) => PostController.updatePost(req, res))
router.delete('/:id', (req, res) => PostController.deletePost(req, res))

export default router
