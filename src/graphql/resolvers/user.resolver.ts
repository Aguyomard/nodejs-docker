import { Context } from '../types/context.types.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
} from '../types/user.types.js'

export const userResolvers = {
  Query: {
    me: (_parent: unknown, _args: unknown, { db }: Context): User | null =>
      db.users.length ? db.users[0] : null,

    user: (_parent: unknown, { id }: UserArgs, { db }: Context): User => {
      const user = db.users.find((user) => user.id === id)
      if (!user) throw new Error(`User with ID ${id} not found`)
      return user
    },

    allUsers: (_parent: unknown, _args: unknown, { db }: Context): User[] =>
      db.users,
  },

  Mutation: {
    createUser: (
      _parent: unknown,
      { input }: CreateUserArgs,
      { db, pubSub }: Context
    ): User => {
      if (!input.name || !input.email) {
        throw new Error('Name and Email are required fields')
      }

      if (db.users.some((user) => user.email === input.email)) {
        throw new Error(`User with email ${input.email} already exists`)
      }

      const newUser: User = {
        id: String(db.users.length + 1),
        ...input,
      }

      db.users.push(newUser)

      pubSub.publish('userCreated', newUser)

      return newUser
    },

    updateUser: (
      _parent: unknown,
      { id, input }: UpdateUserArgs,
      { db }: Context
    ): User => {
      const user = db.users.find((u) => u.id === id)
      if (!user) throw new Error(`User with ID ${id} not found`)

      Object.assign(user, input)
      return user
    },

    deleteUser: (
      _parent: unknown,
      { id }: UserArgs,
      { db }: Context
    ): boolean => {
      const userIndex = db.users.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`)
      }

      db.comments = db.comments.filter((comment) => comment.authorId !== id)

      db.users.splice(userIndex, 1)
      return true
    },
  },

  Subscription: {
    userCreated: {
      subscribe: (_parent: unknown, _args: unknown, { pubSub }: Context) =>
        pubSub.subscribe('userCreated'),
      resolve: (payload: User) => payload,
    },
  },

  User: {
    posts: (parent: User, _args: unknown, { db }: Context) =>
      db.posts.filter((post) => post.authorId === parent.id),
  },
}
