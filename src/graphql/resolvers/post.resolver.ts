import { posts, users, comments } from '../data.js'
import { Post, PostArgs } from '../types/post.types.js'

export const postResolvers = {
  Query: {
    post: (_parent: unknown, { id }: PostArgs): Post => {
      const post = posts.find((p) => p.id === id)
      if (!post) throw new Error(`Post with ID ${id} not found`)
      return post
    },

    allPosts: (): Post[] => posts,
  },

  Post: {
    author: (parent: Post) => users.find((user) => user.id === parent.authorId),
    comments: (parent: Post) =>
      comments.filter((comment) => comment.postId === parent.id),
  },
}
