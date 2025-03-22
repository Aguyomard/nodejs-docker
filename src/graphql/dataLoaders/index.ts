import { PrismaClient } from '@prisma/client'
import { createPostsByUserLoader } from './post.loader.js'

export const createLoaders = (prisma: PrismaClient) => ({
  postsByUser: createPostsByUserLoader(prisma),
})

export type Loaders = ReturnType<typeof createLoaders>
