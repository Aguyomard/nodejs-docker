import express from 'express'
import { PostController } from '../controller/post.controller.js'

const router = express.Router()

// Récupérer tous les posts
router.get('/', (req, res) => PostController.getAllPosts(req, res))

// Créer un nouveau post
router.post('/', (req, res) => PostController.createPost(req, res))

// Mettre à jour un post (remplacement complet)
router.put('/:id', (req, res) => PostController.updatePost(req, res))

// Modifier partiellement un post (mise à jour partielle)
router.patch('/:id', (req, res) => PostController.updatePost(req, res))

// Supprimer un post
router.delete('/:id', (req, res) => PostController.deletePost(req, res))

export default router
