import { Request, Response } from 'express'
import { PostModel } from '../models/post.model.js'
import { type IPost } from '../models/post.model.js'

export class PostController {
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostModel.find()
      res.status(200).json(posts)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Erreur lors de la récupération des posts' })
    }
  }

  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { message, author, likers } = req.body
      if (!message || !author) {
        res
          .status(400)
          .json({ error: "Le message et l'auteur sont obligatoires" })
        return
      }

      const newPost = new PostModel({ message, author, likers })
      const savedPost = await newPost.save()

      res.status(201).json(savedPost)
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du post' })
    }
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const { message, author, likers } = req.body
      const updateData: Partial<IPost> = { message, author, likers }

      const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!updatedPost) {
        res.status(404).json({ error: 'Post non trouvé' })
        return
      }

      res.status(200).json(updatedPost)
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du post' })
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const deletedPost = await PostModel.findByIdAndDelete(id)

      if (!deletedPost) {
        res.status(404).json({ error: 'Post non trouvé' })
        return
      }

      res.status(200).json({ message: 'Post supprimé avec succès' })
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Erreur lors de la suppression du post' + error })
    }
  }
}
