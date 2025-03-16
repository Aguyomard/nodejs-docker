import { createYoga } from 'graphql-yoga'
import { schema } from './schema.js'

export const graphqlHandler = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
})
