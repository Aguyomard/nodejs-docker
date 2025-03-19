import { Context } from '../types/context.types.js'
import {
  Comment,
  CommentArgs,
  CreateCommentArgs,
} from '../types/comment.types.js'

export const commentResolvers = {
  Query: {
    comment: async (
      _parent: unknown,
      { id }: CommentArgs,
      { prisma }: Context
    ): Promise<Comment> => {
      const comment = await prisma.comment.findUnique({
        where: { id },
      })
      if (!comment) {
        throw new Error(`Comment with ID ${id} not found`)
      }
      return comment
    },

    allComments: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ): Promise<Comment[]> => {
      return prisma.comment.findMany()
    },
  },

  Mutation: {
    createComment: async (
      _parent: unknown,
      { input }: CreateCommentArgs,
      { prisma, pubSub }: Context
    ): Promise<Comment> => {
      const post = await prisma.post.findUnique({
        where: { id: input.postId },
      })
      if (!post) {
        throw new Error(`Post with ID ${input.postId} not found`)
      }

      const author = await prisma.user.findUnique({
        where: { id: input.authorId },
      })
      if (!author) {
        throw new Error(`User with ID ${input.authorId} not found`)
      }

      const newComment = await prisma.comment.create({
        data: {
          content: input.text,
          postId: input.postId,
          authorId: input.authorId,
        },
      })

      pubSub.publish(`commentAdded:${input.postId}`, newComment)

      return newComment
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: async (
        _parent: unknown,
        { postId }: { postId: string },
        { prisma, pubSub }: Context
      ) => {
        if (!postId) {
          throw new Error('Post ID is required')
        }

        const post = await prisma.post.findUnique({
          where: { id: postId },
        })
        if (!post) {
          throw new Error(`Post with ID ${postId} not found`)
        }

        return pubSub.subscribe(`commentAdded:${postId}`)
      },
      resolve: (payload: Comment) => payload,
    },
  },

  Comment: {
    post: async (parent: Comment, _args: unknown, { prisma }: Context) => {
      return prisma.post.findUnique({
        where: { id: parent.postId },
      })
    },

    author: async (parent: Comment, _args: unknown, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      })
    },
  },
}
