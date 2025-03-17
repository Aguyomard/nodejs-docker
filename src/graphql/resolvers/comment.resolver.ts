import { db } from '../data.js'
import { Comment, CommentArgs } from '../types/comment.types.js'

export const commentResolvers = {
  Query: {
    comment: (_parent: unknown, { id }: CommentArgs): Comment => {
      const comment = db.comments.find((c) => c.id === id)
      if (!comment) throw new Error(`Comment with ID ${id} not found`)
      return comment
    },

    allComments: (): Comment[] => db.comments,
  },

  Comment: {
    post: (parent: Comment) =>
      db.posts.find((post) => post.id === parent.postId),
    author: (parent: Comment) =>
      db.users.find((user) => user.id === parent.authorId),
  },
}
