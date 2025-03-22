import { db } from '../data.js'
import { PubSub } from 'graphql-yoga'

import { prisma } from '../../config/prisma.js' // singleton
import { Loaders } from '../dataLoaders/index.js'

export type Context = {
  db: typeof db
  prisma: typeof prisma
  pubSub: PubSub<Record<string, any>>
  loaders: Loaders
}
