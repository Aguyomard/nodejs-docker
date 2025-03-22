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
        expiresIn: '1h',
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
  },
}
