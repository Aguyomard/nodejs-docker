import { db } from '../data.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
} from '../types/user.types.js'

export const userResolvers = {
  Query: {
    me: (): User | null => {
      return db.users.length ? db.users[0] : null
    },

    user: (_parent: unknown, { id }: UserArgs): User => {
      const user = db.users.find((user) => user.id === id)
      if (!user) throw new Error(`User with ID ${id} not found`)
      return user
    },

    allUsers: (): User[] => {
      return db.users
    },
  },

  Mutation: {
    createUser: (_parent: unknown, { input }: CreateUserArgs): User => {
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
      return newUser
    },

    updateUser: (_parent: unknown, { id, input }: UpdateUserArgs): User => {
      const user = db.users.find((u) => u.id === id)
      if (!user) {
        throw new Error(`User with ID ${id} not found`)
      }

      Object.assign(user, input)
      return user
    },

    deleteUser: (_parent: unknown, { id }: UserArgs): boolean => {
      const userIndex = db.users.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`)
      }

      for (let i = db.comments.length - 1; i >= 0; i--) {
        if (db.comments[i].authorId === id) {
          db.comments.splice(i, 1)
        }
      }

      db.users.splice(userIndex, 1)
      return true
    },
  },

  User: {
    posts: (parent: User) =>
      db.posts.filter((post) => post.authorId === parent.id),
  },
}
