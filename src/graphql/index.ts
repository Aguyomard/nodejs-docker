import { createHandler } from 'graphql-http/lib/use/express'
import { schema } from './schema.js'
import { resolvers } from './resolvers.js'

export const graphqlHandler = createHandler({
  schema: schema,
  rootValue: resolvers,
})
