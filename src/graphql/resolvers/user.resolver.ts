import { users, comments, posts } from '../data.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
} from '../types/user.types.js'

export const userResolvers = {
  Query: {
    me: (): User | null => {
      return users.length ? users[0] : null
    },

    user: (_parent: unknown, { id }: UserArgs): User => {
      const user = users.find((user) => user.id === id)
      if (!user) throw new Error(`User with ID ${id} not found`)
      return user
    },

    allUsers: (): User[] => {
      return users
    },
  },

  Mutation: {
    createUser: (_parent: unknown, { input }: CreateUserArgs): User => {
      if (!input.name || !input.email) {
        throw new Error('Name and Email are required fields')
      }

      if (users.some((user) => user.email === input.email)) {
        throw new Error(`User with email ${input.email} already exists`)
      }

      const newUser: User = {
        id: String(users.length + 1),
        ...input,
      }

      users.push(newUser)
      return newUser
    },

    updateUser: (_parent: unknown, { id, input }: UpdateUserArgs): User => {
      const user = users.find((u) => u.id === id)
      if (!user) {
        throw new Error(`User with ID ${id} not found`)
      }

      Object.assign(user, input)
      return user
    },

    deleteUser: (_parent: unknown, { id }: UserArgs): boolean => {
      const userIndex = users.findIndex((u) => u.id === id)
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`)
      }

      for (let i = comments.length - 1; i >= 0; i--) {
        if (comments[i].authorId === id) {
          comments.splice(i, 1)
        }
      }

      users.splice(userIndex, 1)
      return true
    },
  },

  User: {
    posts: (parent: User) =>
      posts.filter((post) => post.authorId === parent.id),
  },
}
