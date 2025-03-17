import { mergeResolvers } from '@graphql-tools/merge'
import { userResolvers } from './user.resolver.js'
import { postResolvers } from './post.resolver.js'
import { commentResolvers } from './comment.resolver.js'
import { materialResolvers } from './material.resolver.js'
import { participantResolvers } from './participant.resolver.js'

export const resolvers = mergeResolvers([
  userResolvers,
  postResolvers,
  commentResolvers,
  materialResolvers,
  participantResolvers,
])
