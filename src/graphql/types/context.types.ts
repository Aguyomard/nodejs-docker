import { db } from '../data.js'
import { PubSub } from 'graphql-yoga'

export type Context = {
  db: typeof db
  pubSub: PubSub<Record<string, any>>
}
