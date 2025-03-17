import { db } from '../data.js'
import { Post, PostArgs } from '../types/post.types.js'
export const postResolvers = {
  Query: {
    post: (
      _parent: unknown,
      { id }: PostArgs,
      context: { db: typeof db }
    ): Post => {
      const post = context.db.posts.find((p) => p.id === id)
      if (!post) throw new Error(`Post with ID ${id} not found`)
      return post
    },

    allPosts: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ): Post[] => {
      return context.db.posts
    },
  },

  Post: {
    author: (parent: Post, _args: unknown, context: { db: typeof db }) =>
      context.db.users.find((user) => user.id === parent.authorId),

    comments: (parent: Post, _args: unknown, context: { db: typeof db }) =>
      context.db.comments.filter((comment) => comment.postId === parent.id),
  },
}
