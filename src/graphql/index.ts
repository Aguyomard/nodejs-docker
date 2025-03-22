import { createPubSub, createYoga } from 'graphql-yoga'
import { schema } from './schema.js'
import { db } from './data.js'
import { prisma } from '../config/prisma.js'
import { createLoaders } from './dataLoaders/index.js'
import jwt from 'jsonwebtoken'

const pubSub = createPubSub()

export const graphqlHandler = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: async ({ request }) => {
    const authHeader = request.headers.get('authorization')
    let currentUser = undefined

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        })

        if (user) {
          currentUser = {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }
      } catch (err) {
        console.warn('Invalid token')
      }
    }

    return {
      db,
      prisma,
      pubSub,
      loaders: createLoaders(prisma),
      currentUser,
    }
  },
})
