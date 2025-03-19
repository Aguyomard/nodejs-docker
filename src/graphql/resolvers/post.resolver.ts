import { Context } from '../types/context.types.js'
import { EditPostArgs, Post, PostArgs } from '../types/post.types.js'

export const postResolvers = {
  Query: {
    allPosts: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ): Promise<Post[]> => {
      return prisma.post.findMany()
    },

    post: async (
      _parent: unknown,
      { id }: PostArgs,
      { prisma }: Context
    ): Promise<Post> => {
      const post = await prisma.post.findUnique({
        where: { id },
      })
      if (!post) {
        throw new Error(`Post with ID ${id} not found`)
      }
      return post
    },
  },

  Mutation: {
    createPost: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          title: string
          content: string
          authorId: string
          published: boolean
        }
      },
      { prisma, pubSub }: Context
    ): Promise<Post> => {
      // Vérifier si l'auteur existe
      const author = await prisma.user.findUnique({
        where: { id: input.authorId },
      })
      if (!author) {
        throw new Error(`User with ID ${input.authorId} not found`)
      }

      // Créer le post avec Prisma
      const newPost = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: input.authorId,
          published: input.published,
        },
      })

      if (newPost.published) {
        pubSub.publish('post', {
          data: newPost,
          mutation: 'CREATED',
        })
      }

      return newPost
    },

    editPost: async (
      _parent: unknown,
      { id, input }: EditPostArgs,
      { prisma, pubSub }: Context
    ): Promise<Post> => {
      // Vérifier si le post existe
      const existingPost = await prisma.post.findUnique({
        where: { id },
      })
      if (!existingPost) {
        throw new Error(`Post with ID ${id} not found`)
      }

      // Mettre à jour le post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: input,
      })

      pubSub.publish('post', {
        data: updatedPost,
        mutation: 'UPDATED',
      })

      return updatedPost
    },

    deletePost: async (
      _parent: unknown,
      { id }: { id: string },
      { prisma, pubSub }: Context
    ): Promise<Post> => {
      // Vérifier si le post existe
      const existingPost = await prisma.post.findUnique({
        where: { id },
      })
      if (!existingPost) {
        throw new Error(`Post with ID ${id} not found`)
      }

      // Supprimer le post
      const deletedPost = await prisma.post.delete({
        where: { id },
      })

      pubSub.publish('post', {
        data: deletedPost,
        mutation: 'DELETED',
      })

      return deletedPost
    },
  },

  Subscription: {
    post: {
      subscribe: (_parent: unknown, _args: unknown, { pubSub }: Context) =>
        pubSub.subscribe('post'),
      resolve: (payload: Post) => {
        if (!payload) {
          throw new Error('Received null in subscription payload')
        }
        return payload
      },
    },
  },

  Post: {
    author: async (parent: Post, _args: unknown, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      })
    },

    comments: async (parent: Post, _args: unknown, { prisma }: Context) => {
      return prisma.comment.findMany({
        where: { postId: parent.id },
      })
    },
  },
}
