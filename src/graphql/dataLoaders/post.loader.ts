import DataLoader from 'dataloader'
import { PrismaClient, Post } from '@prisma/client'

export const createPostsByUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (userIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: userIds as string[],
        },
      },
    })

    const postsByUserId: { [key: string]: Post[] } = {}

    for (const post of posts) {
      if (!postsByUserId[post.authorId]) {
        postsByUserId[post.authorId] = []
      }
      postsByUserId[post.authorId].push(post)
    }

    return userIds.map((userId) => postsByUserId[userId] || [])
  })
}
