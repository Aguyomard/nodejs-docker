import { comments, posts, users } from '../data.js'
import { Comment, CommentArgs } from '../types/comment.types.js'

export const commentResolvers = {
  Query: {
    comment: (_parent: unknown, { id }: CommentArgs): Comment => {
      const comment = comments.find((c) => c.id === id)
      if (!comment) throw new Error(`Comment with ID ${id} not found`)
      return comment
    },

    allComments: (): Comment[] => comments,
  },

  Comment: {
    post: (parent: Comment) => posts.find((post) => post.id === parent.postId),
    author: (parent: Comment) =>
      users.find((user) => user.id === parent.authorId),
  },
}
