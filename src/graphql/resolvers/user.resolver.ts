import bcrypt from 'bcryptjs'
import { Context } from '../types/context.types.js'
import {
  User,
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
  AuthPayload,
  LoginUserArgs,
} from '../types/user.types.js'
import jwt from 'jsonwebtoken'
import { getAuthenticatedUserId } from '../../utils/auth.utils.js'

export const userResolvers = {
  Query: {
    me: async (
      _parent: unknown,
      _args: unknown,
      { prisma, currentUser }: Context
    ): Promise<User | null> => {
      if (!currentUser) {
        throw new Error('Unauthorized')
      }

      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
      }
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
      { first = 10, after }: { first?: number; after?: string },
      { prisma }: Context
    ): Promise<{
      edges: { node: User; cursor: string }[]
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
    }> => {
      const take = first
      const cursor = after ? { id: after } : undefined

      const users = await prisma.user.findMany({
        take: take + 1,
        skip: after ? 1 : 0,
        cursor,
        orderBy: { id: 'asc' },
      })

      const hasNextPage = users.length > first
      const usersToReturn = hasNextPage ? users.slice(0, -1) : users

      const edges = usersToReturn.map((user) => ({
        node: user,
        cursor: user.id,
      }))

      const endCursor =
        usersToReturn.length > 0
          ? usersToReturn[usersToReturn.length - 1].id
          : null

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      }
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: CreateUserArgs,
      { prisma, pubSub }: Context
    ): Promise<AuthPayload> => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new Error(`User with email ${input.email} already exists`)
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)

      const newUser = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
      })

      pubSub.publish('userCreated', newUser)

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      })

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age,
        },
        token,
      }
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

    deleteMe: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<boolean> => {
      const userId = getAuthenticatedUserId(context)

      const existingUser = await context.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!existingUser) {
        throw new Error('User not found')
      }

      await context.prisma.user.delete({
        where: { id: userId },
      })

      return true
    },

    loginUser: async (
      _parent: unknown,
      { input }: LoginUserArgs,
      { prisma }: Context
    ): Promise<AuthPayload> => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      )
      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '10h',
      })

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
        token,
      }
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

    email: {
      // fragment: 'fragment userId on User { id }',
      resolve: async (parent: User, _args: unknown, context: Context) => {
        const currentUserId = getAuthenticatedUserId(context, false)

        if (currentUserId === parent.id) {
          return parent.email
        }

        return null
      },
    },
  },
}
