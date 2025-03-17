import { db } from '../data.js'
import { Comment, CommentArgs } from '../types/comment.types.js'

export const commentResolvers = {
  Query: {
    comment: (
      _parent: unknown,
      { id }: CommentArgs,
      context: { db: typeof db }
    ): Comment => {
      const comment = context.db.comments.find((c) => c.id === id)
      if (!comment) throw new Error(`Comment with ID ${id} not found`)
      return comment
    },

    allComments: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ): Comment[] => {
      return context.db.comments
    },
  },

  Comment: {
    post: (parent: Comment, _args: unknown, context: { db: typeof db }) =>
      context.db.posts.find((post) => post.id === parent.postId),

    author: (parent: Comment, _args: unknown, context: { db: typeof db }) =>
      context.db.users.find((user) => user.id === parent.authorId),
  },
}
