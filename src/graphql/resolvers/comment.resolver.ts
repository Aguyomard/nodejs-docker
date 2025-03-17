import { Context } from '../types/context.types.js'
import { Comment, CommentArgs } from '../types/comment.types.js'

export const commentResolvers = {
  Query: {
    comment: (
      _parent: unknown,
      { id }: CommentArgs,
      { db }: Context
    ): Comment => {
      const comment = db.comments.find((c) => c.id === id)
      if (!comment) throw new Error(`Comment with ID ${id} not found`)
      return comment
    },

    allComments: (
      _parent: unknown,
      _args: unknown,
      { db }: Context
    ): Comment[] => db.comments,
  },

  Comment: {
    post: (parent: Comment, _args: unknown, { db }: Context) =>
      db.posts.find((post) => post.id === parent.postId) || null,

    author: (parent: Comment, _args: unknown, { db }: Context) =>
      db.users.find((user) => user.id === parent.authorId) || null,
  },
}
