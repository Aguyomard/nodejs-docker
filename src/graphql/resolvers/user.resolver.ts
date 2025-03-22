import { Context } from '../types/context.types.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
} from '../types/user.types.js'

export const userResolvers = {
  Query: {
    me: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ): Promise<User | null> => {
      const users = await prisma.user.findMany()
      return users.length ? users[0] : null
    },

    user: async (
      _parent: unknown,
      { id }: UserArgs,
      { prisma }: Context
    ): Promise<User> => {
      const user = await prisma.user.findUnique({
        where: { id },
      })
      if (!user) {
        throw new Error(`User with ID ${id} not found`)
      }
      return user
    },

    allUsers: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ): Promise<User[]> => {
      return prisma.user.findMany()
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: CreateUserArgs,
      { prisma, pubSub }: Context
    ) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      })
      if (existingUser) {
        throw new Error(`User with email ${input.email} already exists`)
      }

      const newUser = await prisma.user.create({
        data: input,
      })

      pubSub.publish('userCreated', newUser)

      return newUser
    },

    updateUser: async (
      _parent: unknown,
      { id, input }: UpdateUserArgs,
      { prisma }: Context
    ): Promise<User> => {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      })
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`)
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: input,
      })

      return updatedUser
    },

    deleteUser: async (
      _parent: unknown,
      { id }: UserArgs,
      { prisma }: Context
    ): Promise<boolean> => {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      })
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`)
      }

      await prisma.user.delete({
        where: { id },
      })

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
    posts: async (parent: User, _args: unknown, { loaders }: Context) => {
      return loaders.postsByUser.load(parent.id)
    },
  },
}
