import { db } from '../data.js'
import { PubSub } from 'graphql-yoga'

import { prisma } from '../../config/prisma.js' // singleton
import { Loaders } from '../dataLoaders/index.js'

export interface CurrentUser {
  id: string
  email: string
  name: string
}

export type Context = {
  db: typeof db
  prisma: typeof prisma
  pubSub: PubSub<Record<string, any>>
  loaders: Loaders
  currentUser?: CurrentUser
}
