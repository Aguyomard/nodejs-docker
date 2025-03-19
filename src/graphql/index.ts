import { createPubSub, createYoga } from 'graphql-yoga'
import { schema } from './schema.js'
import { db } from './data.js'
import { prisma } from '../config/prisma.js'

const pubSub = createPubSub()

export const graphqlHandler = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: () => ({
    db,
    prisma,
    pubSub,
  }),
})
