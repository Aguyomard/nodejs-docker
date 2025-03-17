import { db } from '../data.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
} from '../types/user.types.js'

export const userResolvers = {
  Query: {
    me: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ): User | null => {
      return context.db.users.length ? context.db.users[0] : null
    },

    user: (
      _parent: unknown,
      { id }: UserArgs,
      context: { db: typeof db }
    ): User => {
      const user = context.db.users.find((user) => user.id === id)
      if (!user) throw new Error(`User with ID ${id} not found`)
      return user
    },

    allUsers: (
      _parent: unknown,
      _args: unknown,
      context: { db: typeof db }
    ): User[] => {
      return context.db.users
    },
  },

  Mutation: {
    createUser: (
      _parent: unknown,
      { input }: CreateUserArgs,
      context: { db: typeof db }
    ): User => {
      if (!input.name || !input.email) {
        throw new Error('Name and Email are required fields')
      }

      if (context.db.users.some((user) => user.email === input.email)) {
        throw new Error(`User with email ${input.email} already exists`)
      }

      const newUser: User = {
        id: String(context.db.users.length + 1),
        ...input,
      }

      context.db.users.push(newUser)
      return newUser
    },

    updateUser: (
      _parent: unknown,
      { id, input }: UpdateUserArgs,
      context: { db: typeof db }
    ): User => {
      const user = context.db.users.find((u) => u.id === id)
      if (!user) {
        throw new Error(`User with ID ${id} not found`)
      }

      Object.assign(user, input)
      return user
    },

    deleteUser: (
      _parent: unknown,
      { id }: UserArgs,
      context: { db: typeof db }
    ): boolean => {
      const userIndex = context.db.users.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`)
      }

      for (let i = context.db.comments.length - 1; i >= 0; i--) {
        if (context.db.comments[i].authorId === id) {
          context.db.comments.splice(i, 1)
        }
      }

      context.db.users.splice(userIndex, 1)
      return true
    },
  },

  User: {
    posts: (parent: User, _args: unknown, context: { db: typeof db }) =>
      context.db.posts.filter((post) => post.authorId === parent.id),
  },
}
