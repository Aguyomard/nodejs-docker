import { db } from '../data.js'
import { PubSub } from 'graphql-yoga'

import { prisma } from '../../config/prisma.js' // singleton

export type Context = {
  db: typeof db
  prisma: typeof prisma
  pubSub: PubSub<Record<string, any>>
}
