import { Context } from '../types/context.types.js'
import { EditPostArgs, Post, PostArgs } from '../types/post.types.js'

export const postResolvers = {
  Query: {
    allPosts: (_parent: unknown, _args: unknown, { db }: Context): Post[] =>
      db.posts,
    post: (_parent: unknown, { id }: PostArgs, { db }: Context): Post => {
      const post = db.posts.find((p) => p.id === id)
      if (!post) throw new Error(`Post with ID ${id} not found`)
      return post
    },
  },

  Mutation: {
    editPost: (
      _parent: unknown,
      { id, input }: EditPostArgs,
      { db, pubSub }: Context
    ): Post => {
      const post = db.posts.find((p) => p.id === id)
      if (!post) {
        throw new Error(`Post with ID ${id} not found`)
      }

      Object.assign(post, input)

      pubSub.publish('post', {
        data: post,
        mutation: 'UPDATED',
      })

      return post
    },
    deletePost: (
      _parent: unknown,
      { id }: { id: string },
      { db, pubSub }: Context
    ): Post => {
      const postIndex = db.posts.findIndex((p) => p.id === id)

      if (postIndex === -1) {
        throw new Error(`Post with ID ${id} not found`)
      }

      const [deletedPost] = db.posts.splice(postIndex, 1)

      pubSub.publish('post', {
        data: deletedPost,
        mutation: 'DELETED',
      })

      return deletedPost
    },

    createPost: (
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
      { db, pubSub }: Context
    ): Post => {
      if (!input.title || !input.content || !input.authorId) {
        throw new Error('Title, content, and authorId are required')
      }

      const author = db.users.find((u) => u.id === input.authorId)
      if (!author) {
        throw new Error(`User with ID ${input.authorId} not found`)
      }

      const newPost: Post = {
        id: String(db.posts.length + 1),
        title: input.title,
        content: input.content,
        authorId: input.authorId,
        published: input.published,
      }

      db.posts.push(newPost)

      if (newPost.published) {
        pubSub.publish('post', {
          data: newPost,
          mutation: 'CREATED',
        })
      }

      return newPost
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
    author: (parent: Post, _args: unknown, { db }: Context) =>
      db.users.find((user) => user.id === parent.authorId) || null,

    comments: (parent: Post, _args: unknown, { db }: Context) =>
      db.comments.filter((comment) => comment.postId === parent.id),
  },
}
