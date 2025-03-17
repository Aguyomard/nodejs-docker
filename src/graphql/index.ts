import { createPubSub, createYoga } from 'graphql-yoga'
import { schema } from './schema.js'
import { db } from './data.js'

const pubSub = createPubSub()

export const graphqlHandler = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: () => ({
    db,
    pubSub,
  }),
})
