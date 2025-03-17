import { Context } from '../types/context.types.js'
import { Post, PostArgs } from '../types/post.types.js'

export const postResolvers = {
  Query: {
    post: (_parent: unknown, { id }: PostArgs, { db }: Context): Post => {
      const post = db.posts.find((p) => p.id === id)
      if (!post) throw new Error(`Post with ID ${id} not found`)
      return post
    },

    allPosts: (_parent: unknown, _args: unknown, { db }: Context): Post[] =>
      db.posts,
  },

  Post: {
    author: (parent: Post, _args: unknown, { db }: Context) =>
      db.users.find((user) => user.id === parent.authorId) || null,

    comments: (parent: Post, _args: unknown, { db }: Context) =>
      db.comments.filter((comment) => comment.postId === parent.id),
  },
}
