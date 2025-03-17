import { Context } from '../types/context.types.js'
import {
  Comment,
  CommentArgs,
  CreateCommentArgs,
} from '../types/comment.types.js'

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

  Mutation: {
    createComment: (
      _parent: unknown,
      { input }: CreateCommentArgs,
      { db, pubSub }: Context
    ): Comment => {
      if (!input.text || !input.postId || !input.authorId) {
        throw new Error('Text, postId, and authorId are required')
      }

      const post = db.posts.find((p) => p.id === input.postId)
      if (!post) throw new Error(`Post with ID ${input.postId} not found`)

      const author = db.users.find((u) => u.id === input.authorId)
      if (!author) throw new Error(`User with ID ${input.authorId} not found`)

      const newComment: Comment = {
        id: String(db.comments.length + 1),
        content: input.text,
        postId: input.postId,
        authorId: input.authorId,
      }

      db.comments.push(newComment)

      pubSub.publish(`commentAdded:${input.postId}`, newComment)

      return newComment
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: (
        _parent: unknown,
        { postId }: { postId: string },
        { pubSub, db }: Context
      ) => {
        if (!postId) throw new Error('Post ID is required')

        const post = db.posts.find((p) => p.id === postId)
        if (!post) throw new Error(`Post with ID ${postId} not found`)

        return pubSub.subscribe(`commentAdded:${postId}`)
      },
      resolve: (payload: Comment) => payload,
    },
  },

  Comment: {
    post: (parent: Comment, _args: unknown, { db }: Context) =>
      db.posts.find((post) => post.id === parent.postId) || null,

    author: (parent: Comment, _args: unknown, { db }: Context) =>
      db.users.find((user) => user.id === parent.authorId) || null,
  },
}
