import { createYoga } from 'graphql-yoga'
import { schema } from './schema.js'
import { db } from './data.js'

export const graphqlHandler = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: () => ({
    db,
  }),
})
