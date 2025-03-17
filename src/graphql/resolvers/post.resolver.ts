import { db } from '../data.js'
import { Post, PostArgs } from '../types/post.types.js'

export const postResolvers = {
  Query: {
    post: (_parent: unknown, { id }: PostArgs): Post => {
      const post = db.posts.find((p) => p.id === id)
      if (!post) throw new Error(`Post with ID ${id} not found`)
      return post
    },

    allPosts: (): Post[] => db.posts,
  },

  Post: {
    author: (parent: Post) =>
      db.users.find((user) => user.id === parent.authorId),
    comments: (parent: Post) =>
      db.comments.filter((comment) => comment.postId === parent.id),
  },
}
